import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI){
    throw new Error('định nghĩa lại biến môi trường trong .env')
}

const dbConnect = async () =>{
    try {
        if(mongoose.connection.readyState === 0){
            await mongoose.connect(MONGODB_URI);
            console.log('kết nối mongo ở utils');
        }
    }
    catch(error){
        console.log('lỗi kết nối', error)
    }
}

export default dbConnect;