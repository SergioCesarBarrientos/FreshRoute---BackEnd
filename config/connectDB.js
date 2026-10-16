/// importo mongoose, permite trabajar con MongoDB desde Node.js
const mongoose = require('mongoose')


// creo una función asincrona para conectar la aplicacion con MongoDB, async permite utilizar await dentro de la función.
const connectDB = async () => {

    try {
        // intentamos conectarnos usando la URL guardada en el archivo .env., await espera a que la conexión termine antes de continuar.
        await mongoose.connect(process.env.MONGO_URI);

        // Este mensaje aparece si la conexión se realiza correctamente.
        console.log('Se conectó la base de datos')

    } catch (error) {
        // Si la conexión falla, mostramos el error en la terminal.
        console.error('Error al conectar con MongoDB:', error.message)

        // Volvemos a lanzar el error para que quien llamó a la función
        throw error
    }
}

// exporto la función para poder utilizarla desde app.js
module.exports = connectDB;