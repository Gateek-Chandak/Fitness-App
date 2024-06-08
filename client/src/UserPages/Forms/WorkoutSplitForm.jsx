import { useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';
import { useWorkoutSplit } from "../../Contexts/WorkoutSplitContext";
import { CirclePicker } from 'react-color';

const WorkoutSplitForm = ( ) => {

    const { splits, setSplits } = useWorkoutSplit()
    const { session, user_id } = useAuth();
    const [splitName, setSplitName] = useState('')
    const [item, setItem] = useState('')
    const [colour, setColour] = useState('#FFF');
    const [splitItems, setSplitItems] = useState([])
    const [email, setEmail] = useState(session.user.email)
    const [error, setError] = useState(null)

    const handleAddItem = (e) => {
        e.preventDefault();
        if (item === '') {
            setError('Cannot have empty day')
            setTimeout(() => {
                setError(null)
            }, [5000])
            return
        } else if (splitItems.filter(item => item.colour === colour).length > 0) {
            setError('Choose a unique colour')
            setTimeout(() => {
                setError(null)
            }, [5000])
            return
        } else if (colour === '#FFF') {
            setError('Select a colour')
            setTimeout(() => {
                setError(null)
            }, [5000])
            return
        }
        setSplitItems([...splitItems, {name: item, colour: colour}]);
        setItem(''); 
        setColour("#FFF");
        setError(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!session) {
            setError('Session not active')
            return
        } 

        setEmail(session.user.email)          

        if(splitName.length < 2) {
            setError('Name must be at least 2 characters long')
            setTimeout(() => {
                console.log(splits)
                setError(null)
            }, [5000])
            return 
        } else if (splits && splits.some(split => split['split_name'] === splitName)) {
            setError('Name already exists')
            setTimeout(() => {
                setError(null)
            }, [5000])
            return
        } else if (splitItems.length < 1) {
            setError('Split must be have at least one item')
            setTimeout(() => {
                setError(null)
            }, [5000])
            return
        } else if (!user_id) {
            setError('Invalid Credentials')
            setTimeout(() => {
                setError(null)
            }, [5000])
            return
        }
        try {
            const split = {
                split_name: splitName,
                items: splitItems,
                email,
                user_id
            }
            const response = await fetch('http://localhost:4000/api/workoutSplits/addSplits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(split)
            })
            setSplits([...splits, split])
            setError(null)
            setSplitName('')
            setSplitItems([])
            setColour("#FFF")
        } catch (err) {
            setError('Invalid Input')
            console.log(err)
        }
    }

    return ( 
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 shadow-lg p-2 w-1/3">
            <div className="flex flex-row">
                <label className="m-2">Routine Name:</label>
                <input
                    className="h-8 border-black border rounded-md"
                    type="text"
                    value={splitName}
                    onChange={(e) => setSplitName(e.target.value)}
                />
            </div>
            <div>
                <label className="m-2">Add Item:</label>
                <input
                    className="h-8 border-black border rounded-md"
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                />
            </div>
            <div className="inline-flex justify-center">
                <CirclePicker
                color={colour}
                onChangeComplete={(newColor) => setColour(newColor.hex)}
                />
            </div>
            <button className=" border-black border"onClick={handleAddItem}>Add</button>
            <ul>
                {(splitItems.length > 0) && splitItems.map((item) => (
                    <div key={uuidv4()} className="flex flex-row gap-5 items-center">
                        <li>{item.name}</li>
                        <div className="rounded-full w-5 h-5" style={{ backgroundColor: item.colour}}></div>
                    </div>

                ))}
            </ul>
            <button type="submit" className="m-4 p-1 w-32  border-black border rounded-xl">Submit</button>
            {error && <h1 className="text-red-500">{error}</h1>}
        </form>
     );
}
 
export default WorkoutSplitForm;