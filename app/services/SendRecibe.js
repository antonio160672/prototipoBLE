import React, { useEffect, useState } from 'react'
import NGSI from 'ngsi-parser'
export const sendDataFiware = async (data,URLTRU,experimento,entity) => {
  var opcion = false
  var arraF = []
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
        console.log(JSON.stringify(entity))
        console.log(response)
        opcion = true;
        URLTRU = URLTRU + experimento + "/attrs"
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
        console.log(JSON.stringify(entity))
        console.log(response)
        console.log("\n")
      }).catch(err => console.log("api Erorr: ", err.response))
    }
    Object.keys(entity).forEach(function (key) {
      if (!(typeof entity[key].metadata === 'undefined')) {
        if (!(typeof entity[key].metadata['ubicacion'] === 'undefined')) {
          if (entity[key].metadata['ubicacion'].value === 'Pierna') {
            entity[key].value = []
            entity['Pierna'].value = ""
          } else if (entity[key].metadata['ubicacion'].value === 'Cintura') {
            entity[key].value = []
            entity['Cintura'].value = ""
          } else if (entity[key].metadata['ubicacion'].value === 'Mano') {
            entity[key].value = []
            entity['Mano'].value = ""
          }
        }
      }
    });
    console.log(JSON.stringify(entity))
    arraAxiliar = []
  }
  return arraF;
}