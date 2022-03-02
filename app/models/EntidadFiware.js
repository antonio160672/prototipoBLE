import NGSI from 'ngsi-parser'

export const  entidadFiware = (experimento) => {
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