import React, { useEffect, useState } from 'react'
import { Image, View, StyleSheet, Button, Alert } from 'react-native';
import { DataTable, IconButton } from 'react-native-paper';
import {
  getExperimento,
  getdataExperiment,
  deletedata
} from '../services/db-service';
import RNFetchBlob from 'react-native-fetch-blob';
import NGSI from 'ngsi-parser'
var experimentos;
var dataExper;
import Toast from 'react-native-simple-toast';

// let iconLeft={require('C:\Users\dare2\Documents\react native\prototipoBLE\app\iconos')}
// let iconRight={require('../iconos/ic_settings.png')}
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

  const entidadcreacion = (experimento) => {
    var entity = NGSI.parseEntity({
      id: experimento,
      type: 'persona',
      Cintura: {
        value: "",
        metadata: {
        }
      },
      Pierna: {
        value: "",
        metadata: {
        }
      },
      Mano: {
        value: "",
        metadata: {
        }
      },
      dateStamp: new Date()
    })
    var Cinturaejesx = {
      "value": [],
      "type": "StructuredValue",
      "metadata": {
        "macaddres": {
          "value": '',
          "type": "text"
        },
        "eje": {
          "value": "x",
          "type": "Text"
        },
        "ubicacion": {
          "value": "Cintura",
          "type": "Text"
        }
      }
    }
    var Cinturaejesy = {
      "value": [],
      "type": "StructuredValue",
      "metadata": {
        "macaddres": {
          "value": '',
          "type": "text"
        },
        "eje": {
          "value": "y",
          "type": "Text"
        },
        "ubicacion": {
          "value": "Cintura",
          "type": "Text"
        }
      }
    }
    var Cinturaejesz = {
      "value": [],
      "type": "StructuredValue",
      "metadata": {
        "macaddres": {
          "value": '',
          "type": "text"
        },
        "eje": {
          "value": "z",
          "type": "Text"
        },
        "ubicacion": {
          "value": "Cintura",
          "type": "Text"
        }
      }
    }
    var Piernaejesx = {
      "value": [],
      "type": "StructuredValue",
      "metadata": {
        "macaddres": {
          "value": '',
          "type": "text"
        },
        "eje": {
          "value": "x",
          "type": "Text"
        },
        "ubicacion": {
          "value": "Pierna",
          "type": "Text"
        }
      }
    }
    var Piernaejesy = {
      "value": [],
      "type": "StructuredValue",
      "metadata": {
        "macaddres": {
          "value": '',
          "type": "text"
        },
        "eje": {
          "value": "y",
          "type": "Text"
        },
        "ubicacion": {
          "value": "Pierna",
          "type": "Text"
        }
      }
    }
    var Piernaejesz = {
      "value": [],
      "type": "StructuredValue",
      "metadata": {
        "macaddres": {
          "value": '',
          "type": "text"
        },
        "eje": {
          "value": "z",
          "type": "Text"
        },
        "ubicacion": {
          "value": "Pierna",
          "type": "Text"
        }
      }
    }
    var Manoejesx = {
      "value": [],
      "type": "StructuredValue",
      "metadata": {
        "macaddres": {
          "value": '',
          "type": "text"
        },
        "eje": {
          "value": "x",
          "type": "Text"
        },
        "ubicacion": {
          "value": "Mano",
          "type": "Text"
        }
      }
    }
    var Manoejesy = {
      "value": [],
      "type": "StructuredValue",
      "metadata": {
        "macaddres": {
          "value": '',
          "type": "text"
        },
        "eje": {
          "value": "y",
          "type": "Text"
        },
        "ubicacion": {
          "value": "Mano",
          "type": "Text"
        }
      }
    }
    var Manoejesz = {
      "value": [],
      "type": "StructuredValue",
      "metadata": {
        "macaddres": {
          "value": '',
          "type": "text"
        },
        "eje": {
          "value": "z",
          "type": "Text"
        },
        "ubicacion": {
          "value": "Mano",
          "type": "Text"
        }
      }
    }
    var Fecha_inicio = {
      "value": "",
      "type": "DateTime",
      "metadata": {
      }
    }
    var Fecha_fin = {
      "value": "",
      "type": "DateTime",
      "metadata": {
      }
    }
    entity.Cinturaejesx = Cinturaejesx
    entity.Cinturaejesy = Cinturaejesy
    entity.Cinturaejesz = Cinturaejesz
    entity.Piernaejesx = Piernaejesx
    entity.Piernaejesy = Piernaejesy
    entity.Piernaejesz = Piernaejesz
    entity.Manoejesx = Manoejesx
    entity.Manoejesy = Manoejesy
    entity.Manoejesz = Manoejesz
    entity.Fecha_inicio = Fecha_inicio
    entity.Fecha_fin = Fecha_fin

    Object.keys(entity).forEach(function (key) {
      if (!(typeof entity[key].metadata === 'undefined')) {
        if (!(typeof entity[key].metadata['ubicacion'] === 'undefined')) {
          if (entity[key].metadata['ubicacion'] === 'Pierna') {
            entity[key].value = []
          } else if (entity[key].metadata['ubicacion'] === 'Cintura') {
            entity[key].value = []
          } else if (entity[key].metadata['ubicacion'] === 'Mano') {
            entity[key].value = []
          }
        }
      }
    });
    return entity;
  }

  const csvdata = async (data, experimento) => {
    var Url="http://187.188.90.137:1026/v2/entities/"
    //var Url="http://192.168.1.95:1026/v2/entities/"
    //consulta crate
    //SELECT "entity_id","cinturaejesx","cinturaejesy","cinturaejesz","piernaejesx","piernaejesy","piernaejesz","manoejesx","manoejesy","manoejesz","fecha_inicio","fecha_fin" FROM "doc"."etpersona"  where "fecha_inicio"='1637731182000'  LIMIT 100;
    
    var URLTRU=Url
    if (true) {
      debugger
      var arraF = []
      var entity = entidadcreacion(experimento)
      var opcion = false

      for (const [key, objetos] of Object.entries(data)) {
        var arraAxiliar = []
        if (opcion) {
          delete entity.id
          delete entity.type
        }
        let dataacele = JSON.parse(objetos.Data);
        for (var prop in dataacele) {
          var pieces = dataacele[prop].split(",");
          pieces.push(experimento)
          arraAxiliar.push(pieces)
          arraF.push(pieces)
        }

        var tamano = arraAxiliar.length
        arraAxiliar.forEach(function (array) {
          entity[array[5]].value = array[4]

          Object.keys(entity).forEach(function (key) {
            if (!(typeof entity[key].metadata === 'undefined')) {
              if (!(typeof entity[key].metadata['ubicacion'] === 'undefined')) {
                if (entity[key].metadata['ubicacion'].value === array[5]) {
                  entity[key].metadata['macaddres'].value = array[4]
                  if (entity[key].metadata['eje'].value === 'x') {
                    entity[key].value.push(array[0]);
                  } else if (entity[key].metadata['eje'].value === 'y') {
                    entity[key].value.push(array[1]);
                  } else if (entity[key].metadata['eje'].value === 'z') {
                    entity[key].value.push(array[2]);
                  }
                }
              }
            }
          });
        });
        entity['Fecha_inicio'].value = arraAxiliar[0][3]
        entity['Fecha_fin'].value = arraAxiliar[tamano - 1][3]

        console.log(JSON.stringify(entity))
        if (!opcion) {
          await fetch(URLTRU, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(entity)
          }).then(response => {
            console.log(response)            
            opcion = true;            
            URLTRU=URLTRU + experimento + "/attrs"
          }).catch(err => console.log("api Erorr: ", err.response))
        }
        if (opcion) {
          await fetch(URLTRU, {
            method: "PATCH",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(entity)
          }).then(response => {
            console.log(response)
            console.log("\n")
          }).catch(err => console.log("api Erorr: ", err.response))
        }
        Object.keys(entity).forEach(function (key) {
          if (!(typeof entity[key].metadata === 'undefined')) {
            if (!(typeof entity[key].metadata['ubicacion'] === 'undefined')) {
              if (entity[key].metadata['ubicacion'].value === 'Pierna') {
                entity[key].value = []
              } else if (entity[key].metadata['ubicacion'].value === 'Cintura') {
                entity[key].value = []
              } else if (entity[key].metadata['ubicacion'].value === 'Mano') {
                entity[key].value = []
              }
            }
          }
        });
        console.log(JSON.stringify(entity))
        arraAxiliar = []
      }
      const headerString = 'X-acele,Y-acele, Z-acele, Fecha, Dispositivo, ubicacion, Experimento\n';
      const rowString = arraF.map(d => `${d[0]},${d[1]},${d[2]},${d[3]},${d[4]},${d[5]},${d[6]}\n`).join('');
      const csvString = `${headerString}${rowString}`;

      const pathToWrite = "/storage/emulated/0/Documents/data.csv";
      console.log('pathToWrite', pathToWrite);
      RNFetchBlob.fs
        .writeFile(pathToWrite, csvString, 'utf8')
        .then(() => {
          console.log(`wrote file ${pathToWrite}`);
        })
        .catch(error => console.error(error));

      console.dir(JSON.stringify(entity))
      arraF = []
      entity={}
      Toast.show('Se finalizo el guardado de los datos', Toast.LONG);


    }
  }

  const saveData = (id, experimento) => {
    getdataExperiment(data => {
      csvdata(data, experimento)      
      
    }, id)
  }
  const delate_data = (id) => {
    deletedata(id)
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