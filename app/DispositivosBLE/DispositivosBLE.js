import React, {
    useState,
    useEffect,
} from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StatusBar,
    NativeModules,
    NativeEventEmitter,
    Platform,
    PermissionsAndroid,
    FlatList,
    TouchableOpacity
} from 'react-native';
import Toast from 'react-native-simple-toast';
import moment from 'moment';

import Styles from './componentesDispositivosBLE'
import { Buffer } from "buffer"
import BleManager from 'react-native-ble-manager';
import Subtitle from '../subtitle';
import Divice from '../Divice/divice';
import Empty from '../Empty/empty';
import MainFeedPost from "../models/index"
import {
    createTable,
    adddata,
    getdata
} from '../services/db-service';
let arraF;
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const peripherals = new Map();
{/*
    -agregar una verificacion en el boton scan bluetooth y ver 
    si esta activo el bluetooh
    -arreglar diseño de la lista de dispositivos
    -cuando se seleccione el item del dispositivo y no se 
    conecte poner rojo y mostrar mensaje de reintentar
    -arreglar el scroll de la lista
*/}
function DispositivosBLE(props) {
    
    const [Post, setMainFeedPost]=useState(new MainFeedPost())
    const [isScanning, setIsScanning] = useState(false);
    const [peripherals, setPeripherals] = useState(new Map());
    const [peripheralInfo2, setPeripheralInfo] = useState(new Map());
    const [list, setList] = useState([]);
    const [realTime, setRealTime] = useState(false);
    const [arrayAcele, setArrayAcele] = useState([]);
    const render = ({ item, index }) => {
        return <Divice
            {...item}
            iconLeft={require('../iconos/ic_laptop.png')}
            iconRight={require('../iconos/ic_settings.png')}
            onPress={() => testPeripheral(item)}
        />
    }

    const createtable = async () => {
        //debugger
        // createTable()   
        // adddata()
        // getdata()
    }

    useEffect(() => {

        
        createtable();

        BleManager.start({ showAlert: false });
        console.log("primero en ejecutar")

        bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
        bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
            });
        }

        return (() => {
            console.log('unmount');
            bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
            bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
            bleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
            bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        })
    }, []);

    useEffect(() => {
        debugger
        let interval;
        if (realTime) {
            interval = setInterval(() => {
                console.log(arraF, 'el ultimo')
                insertInfo()
                setArrayAcele([]);
                arraF=[]
            }, 30000);
        } else {
            clearInterval(interval);
            setArrayAcele([]);
            setList([])
            arraF=[]
        }
        return () => clearInterval(interval);
    }, [realTime]);

    useEffect(() => {
        debugger
        if(arrayAcele.length!=0){
            arraF.push(arrayAcele)
        }
    }, [JSON.stringify(arrayAcele)]);

    const insertInfo = () => {
        let data = arraF.toString()
        let data2=JSON.stringify(Object.assign({}, arraF))
        console.log(data);
        console.log("\n");
        console.log(data2);
    }

    const startScan = () => {
        setList([])
        if (!isScanning) {
            BleManager.scan([], 3, true).then((results) => {
                console.log("primero en entrar")
                console.log('Scanning...');
                setIsScanning(true);
            }).catch(err => {
                console.error(err);
            });
        }
    }

    const handleDiscoverPeripheral = (peripheral) => {
        console.log("segundo en entrar?")
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }
        setPeripherals(peripherals.set(peripheral.id, peripheral));
        setList(Array.from(peripherals.values()));
    }

    const handleStopScan = () => {
        console.log("tercero en entrar?")

        console.log("que es peripherals", peripherals)
        console.log("que es peripherals", peripherals)
        console.log('Scan is stopped');
        setIsScanning(false);
        setArrayAcele([])
    }

    const handleDisconnectedPeripheral = (data) => {
        console.log('1')
        let peripheral = peripherals.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            peripherals.set(peripheral.id, peripheral);
            setList(Array.from(peripherals.values()));
        }
        setRealTime(false)
        console.log('Disconnected from ' + data.peripheral);
    }

    const retrieveConnected = () => {
        console.log('2')
        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                console.log('No connected peripherals')
            }
            for (var i = 0; i < results.length; i++) {
                var peripheral = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                testPeripheral2(peripheral)
                setList(Array.from(peripherals.values()));
            }
        }).catch((error) => {
            console.log('Connection error', error);
        });
    }

    const handleUpdateValueForCharacteristic = async (data) => {
        const buffer = Buffer.from(data.value);
        var date = moment()
            .format('YYYY-MM-DD hh:mm:ss a');

        const dataacelero = buffer.toString() + "," + date + ";";
        setRealTime(true)
        setArrayAcele(dataacelero)

    }

    const testPeripheral2 = (peripheral) => {
        console.log('5')
        console.log(peripheral)
        if (peripheral) {
            console.log("hola mundo se conecto")
            console.log(peripheral)
            console.log('Connected to ' + peripheral.id);
            setTimeout(() => {
                let d = peripheralInfo2.get(peripheral.id);
                console.log(d);
                BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                    var service = peripheralInfo.characteristics[3].service;
                    var bakeCharacteristic = peripheralInfo.characteristics[3].characteristic;
                    setTimeout(() => {
                        BleManager.startNotification(peripheral.id, service, bakeCharacteristic).then(
                            (readData) => {
                            }).catch((error) => {
                                console.log('Notification error', error);
                            });
                    }, 200);
                });
            }, 900);
        }
    }

    const testPeripheral = (peripheral) => {
        // console.log('3')
        if (peripheral) {
            if (peripheral.connected) {
                let d = peripherals.get(peripheral.id);
                if (d) {
                    debugger
                    d.connected = "undefined";
                    setPeripherals(peripherals.set(peripheral.id, d))
                    setList(Array.from(peripherals.values()));
                }
                BleManager.disconnect(peripheral.id);
            } else {
                BleManager.connect(peripheral.id).then(() => {
                    let d = peripherals.get(peripheral.id);
                    if (d) {
                        d.connected = true;
                        setPeripherals(peripherals.set(peripheral.id, d))
                        setList(Array.from(peripherals.values()));
                    }
                    console.log('Connected to ' + peripheral.id);
                    setTimeout(() => {
                        BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                            console.log(peripheralInfo)
                            setPeripheralInfo(peripheralInfo2.set(peripheral.id, peripheralInfo))
                            console.log(peripheralInfo.characteristics[3].characteristic);
                            console.log(peripheralInfo.characteristics[3].service);
                            var service = peripheralInfo.characteristics[3].service;
                            var bakeCharacteristic = peripheralInfo.characteristics[3].characteristic;
                            setTimeout(() => {
                                BleManager.read(peripheral.id, service, bakeCharacteristic).then(
                                    (readData) => {
                                        console.log(readData);
                                        const buffer = Buffer.from(readData);
                                        console.log(`valor del buffer ${buffer}`);
                                    }).catch((error) => {
                                        console.log('Notification error', error);
                                    });
                            }, 200);
                        });
                    }, 900);
                }).catch((error) => {
                    console.log('Connection error', error);
                });
            }
        }
    }


    return (
        <>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView

                contentInsetAdjustmentBehavior="automatic">

                <ScrollView
                    style={Styles.scrollView}>
                    {global.HermesInternal == null ? null : (
                        <View style={Styles.engine}>
                            <Text style={Styles.footer}>Engine: Hermes</Text>
                        </View>
                    )}
                    <View style={Styles.body}>
                        <View style={{ margin: 10 }}>
                            <TouchableOpacity
                                onPress={() => startScan()}
                                style={Styles.appButtonContainer}
                            >
                                <Text
                                    style={Styles.appButtonText}
                                >
                                    {'Scan Bluetooth (' + (isScanning ? 'on' : 'off') + ')'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ margin: 10 }}>

                            {!realTime && (
                                <TouchableOpacity
                                    onPress={() => retrieveConnected()}
                                    style={Styles.appButtonContainer}
                                >
                                    <Text
                                        style={
                                            Styles.appButtonText}
                                    >
                                        Recuperar periféricos conectados
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Subtitle title="Lista de Dispositivos" />
                        {(list.length == 0) &&
                            <Empty text='No hay dispositivos' />
                        }

                    </View>
                </ScrollView>

                {(list.length > 0) && (
                    <FlatList
                        data={list}
                        renderItem={
                            render
                        }

                    />
                )}
            </SafeAreaView>
        </>
    )
}

export default DispositivosBLE;