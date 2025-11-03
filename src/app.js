// ejemplo
import express from 'express';
const app = express();
app.use(express.json());
// ... tus rutas
export default app;           // Exporta la app

// si levantas el server en otro archivo, no lo uses aquí
// const server = app.listen(process.env.PORT || 3000);
