import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native';
import Layout from '../Layout/layout'
import Form from '../Form/form';
import Constantes from './constantes'
import Toast from 'react-native-simple-toast';
import DispositivosBLE from '../DispositivosBLE/DispositivosBLE'
import MainFeedPost from "../models/index"
import {
    createTable,
    adddata,
    getdata
} from '../services/db-service';

function BluetoothList(props) {
    const [expeName, setExperiment] = useState('')
    const [errors, setExErrors] = useState(false)
    const [Post, setMainFeedPost]=useState(new MainFeedPost())

    const createtable = async () => {
        createTable()   
    }

    useEffect(() => {
        createtable();
    }, []);
    
    const clickButton = () => {
        getdata()
        // console.log(expeName)
        // if (expeName.length > 0) {
        //     Toast.show('Experimento guardado');
        //     setExErrors(false)
        // } else {
        //     Toast.show('Favor de ingresar el nombre el experimeto', Toast.LONG);
        // }
    }

    return (
        <Layout title={Constantes.Title_Aplication}>
            {errors && (
                <Form
                    onPress={clickButton}
                    onChangeText={(text) => setExperiment(text)}
                />

            )}
            {/*-Agregar un nuevo boton para recuperar todos los
               los experimentos, mostar en una tabla 
               -con un buton para eliminar o exportar como csv*/}
            {!errors && (
                <DispositivosBLE
                    expeName={expeName}
                />
            )}
            {/* -Desplegar un ventana flotante (modal) de confirmacion 
                -El render del form se quitara cuadno se haya 
                    ingresado el nombre del experimento*/}
        </Layout>
    )
}
export default BluetoothList;