import NoteModel from '../models/note.schema.js';

export const addNote=async(req, res)=>{
    const {title, description, status, priority}=req.body;
    //store in db
    console.log("not",req.body)
    try{
        const note = new NoteModel({user: req.user.id, title, description, status, priority})
    await note.save()
    res.status(200).send({'message':"Note is saved in db", note:note})
    }catch(error){
        res.status(400).send({ error: 'error in saving note to db' })
    }
}

export const getNotes=async(req, res)=>{
    try {
        const notes = await NoteModel.find({ user: req.user.id });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

export const updateNote=async(req, res)=>{
    const { id } = req.params;
    console.log("id from params", id)
    const { title, description, status, priority } = req.body;
    try {
        const note = await NoteModel.findById(id);
        console.log(note)
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        console.log("updated title",title)
        note.title = title || note.title;
        note.description = description || note.description;
        note.status = status || note.status;
        note.priority = status || note.priority;
        
        const updatedNote = await note.save();
        console.log("updated note", updatedNote)
        res.status(200).json(updatedNote);
    } catch (error) {
        // console.log(error, "error")
        res.status(500).json({ message: 'Server Error', error:error});
    }
}

export const deleteNote=async(req, res)=>{
    const { id } = req.params;
    try {
        const note = await NoteModel.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await NoteModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Note removed' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server Error' });
    }  
}
