import React, { useEffect, useState } from 'react'
import { View, StyleSheet, } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import {
  getExperimento,
  getdataExperiment,
  deletedata
} from '../services/db-service';
import { entidadFiware } from '../models/EntidadFiware';
import { sendDataFiware } from '../services/SendRecibe';

import RNFetchBlob from 'react-native-fetch-blob';
var experimentos;
var dataExper;
import Toast from 'react-native-simple-toast';

export default App = () => {
  const [errors, setExErrors] = useState(false)
  const [Experimen, setExperimen] = useState([]);

  const dataconsult = async () => {
    getExperimento(value1 => {
      setExperimen(value1)
    })
  }

  useEffect(() => {
    dataconsult()
  }, []);

  useEffect(() => {
    console.log("data pasada", experimentos)
    console.log("data pasada", dataExper)
  }, [errors]);

  const saveData = (id, experimento) => {
    getdataExperiment(data => {
      savedatacsvFiware(data, experimento)
    }, id)
  }

  const delate_data = (id) => {
    deletedata(id)
  }

  const savedatacsvFiware = async (data, experimento) => {
    //var Url="http://187.188.90.137:1026/v2/entities/"
    var Url = "http://192.168.1.95:1026/v2/entities/"

    var URLTRU = Url
    var entity = entidadFiware(experimento)
    debugger
    console.log(entity)
    var arraF = await sendDataFiware(data, URLTRU, experimento, entity)
    debugger
    console.log(arraF)

    //se queda esta parte pero modular la parte de arriba
    const headerString = 'X-acele,Y-acele, Z-acele, Fecha, Dispositivo, ubicacion, Experimento\n';
    const rowString = arraF.map(d => `${d[0]},${d[1]},${d[2]},${d[3]},${d[4]},${d[5]},${d[6]}\n`).join('');
    const csvString = `${headerString}${rowString}`;

    const pathToWrite = "/storage/emulated/0/Documents/" + experimento + ".csv";
    console.log('pathToWrite', pathToWrite);
    RNFetchBlob.fs
      .writeFile(pathToWrite, csvString, 'utf8')
      .then(() => {
        console.log(`wrote file ${pathToWrite}`);
      })
      .catch(error => console.error(error));

    console.dir(JSON.stringify(entity))
    arraF = []
    entity = {}
    Toast.show('Se finalizo el guardado de los datos', Toast.LONG);
  }

  return (
    <View>
      <DataTable>
        <DataTable.Header style={styles.databeHeader}>
          <DataTable.Title>Experimento</DataTable.Title>
          <DataTable.Title>Eliminar</DataTable.Title>
          <DataTable.Title>Guardar</DataTable.Title>
        </DataTable.Header>
        {
          Experimen.map((l, i) => (
            <DataTable.Row style={styles.databeBox} key={l.Expe_id} >
              <DataTable.Cell>{l.Expe_name}</DataTable.Cell>
              <DataTable.Cell style={styles.Cellimage}>
                <IconButton
                  icon={require('../iconos/delete.png')}
                  size={20}
                  onPress={() => delate_data(l.Expe_id, l.Expe_name)}
                />
              </DataTable.Cell>
              <DataTable.Cell>
                <IconButton
                  icon={require('../iconos/save.png')}
                  size={20}
                  onPress={() => saveData(l.Expe_id, l.Expe_name)}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))
        }
      </DataTable>

    </View>
  );
}


const styles = StyleSheet.create({
  databeBox: {
    margin: 7,
    textAlign: 'center',
  },
  iconLeft: {
    width: 17,
    height: 17,
  },
  Cellimage: {
    marginLeft: 32,
    alignItems: 'center',
  }
});