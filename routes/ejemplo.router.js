import { Router } from "express";
const ejemploRouter = Router();

ejemploRouter.get('/', (req, res) => {
    res.json({ message: 'Hello from ejemplo route!' });

});

ejemploRouter.get('/:id', (req, res) => {
    const  id  = req.params.id;
    res.json({ message: `Hello from ejemplo route with ID`, id  });
});

ejemploRouter.put('/:id', (req, res) => {
    const body = req.body;
    res.json({ message: 'PUT request to ejemplo route', body });
});

ejemploRouter.post('/', (req, res) => {
    const body = req.body;
    res.json({ message: 'POST request to ejemplo route', body });
});

ejemploRouter.delete('/:id', (req, res) => {
    const  id  = req.params.id;
    res.json({ message: `DELETE request to ejemplo route with ID`, id  });
});

export default ejemploRouter;