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

import moment from 'moment';

import Styles from './componentesDispositivosBLE'
import { Buffer } from "buffer"
import BleManager from 'react-native-ble-manager';
import Subtitle from '../subtitle';
import Divice from '../Divice/divice';
import Empty from '../Empty/empty';
import UserModel from "../models/index"
import {
    getdata,
    addDivice,
    adddata
} from '../services/db-service';

let _ = require('underscore')


let global = false;
let deviceObje = new Object();
let interval;
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
    const [dive, setMaindive] = useState(new UserModel())
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

    const createtable = () => {
        getdata()
    }
    const adddivice = async () => {
        if (dive.getMacaddres().length != 0) {
            addDivice(dive)
        }
    }

    useEffect(() => {

        createtable();
        console.log(deviceObje)

        BleManager.start({ showAlert: false });

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

    useEffect(async () => {
        for (let prop in deviceObje) {
            deviceObje[prop] = []
        }
        console.log(deviceObje);
        if (realTime) {
            interval = setInterval(() => {
                insertInfo()
                for (let prop in deviceObje) {
                    deviceObje[prop] = []
                }
            }, 30000);
        } else {
            clearInterval(interval);
            setArrayAcele([]);
            //setList([])
        }
        return () => clearInterval(interval);
    }, [realTime]);

    const insertInfo = async () => {
        adddata(deviceObje)
    }

    const startScan = async () => {
        setList([])
        if (!isScanning) {
            await BleManager.scan([], 3, true).then((results) => {
                console.log('Scanning...');
                setIsScanning(true);
            }).catch(err => {
                console.error(err);
            });
        }
    }

    const handleDiscoverPeripheral = (peripheral) => {
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }
        setPeripherals(peripherals.set(peripheral.id, peripheral));
        setList(Array.from(peripherals.values()));
    }

    const handleStopScan = () => {
        console.log("dispositivos", peripherals)
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
        setMaindive("")
        setMaindive(new UserModel())
        setRealTime(false)
        console.log('Disconnected from ' + data.peripheral);
    }
    const disconect = () => {
        console.log('desconectar')
        for (const [key, Data1] of Object.entries(deviceObje)) {
            let peripheral = peripherals.get(key);
            if (peripheral) {
                peripheral.connected = false;
                console.log(peripheral.id);
                BleManager.disconnect(key);
                peripherals.set(peripheral.id, peripheral);
                setList(Array.from(peripherals.values()));
            }
            setMaindive("")
            setMaindive(new UserModel())
            setRealTime(false)
            console.log('Disconnected from ' + key);
        }
        props.setExErrors(true)
        console.log("holamundo")
        
    }


    const retrieveConnected = async () => {
        await BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                console.log('No connected peripherals')
            }
            results.forEach((result) => {
                result.connected = true;
                peripherals.set(result.id, result);
                setRealTime(true)
                global = true//cambiar
                setList(Array.from(peripherals.values()));
            })
        }).catch((error) => {
            console.log('Connection error', error);
        });
    }

    const handleUpdateValueForCharacteristic = async ({ value, peripheral, characteristic, info }) => {
        if (global) {
            var data = peripherals.get(peripheral);
            const buffer = Buffer.from(value);
            var date = moment()
            .format('YYYY-MM-DDThh:mm:ss');
            const dataacelero = buffer.toString() + "," + date + "," + peripheral + "," + data.name;
            deviceObje[peripheral].push(dataacelero)
        }

    }

    const testPeripheral = async (peripheral) => {
        if (peripheral) {
            if (peripheral.connected) {
                let d = peripherals.get(peripheral.id);
                if (d) {
                    d.connected = "undefined";
                    setPeripherals(peripherals.set(peripheral.id, d))
                    setList(Array.from(peripherals.values()));
                }
                await BleManager.disconnect(peripheral.id);
            } else {
                await BleManager.connect(peripheral.id).then(() => {
                    let d = peripherals.get(peripheral.id);
                    if (d) {
                        d.connected = true;
                        setPeripherals(peripherals.set(peripheral.id, d))
                        setList(Array.from(peripherals.values()));
                    }
                    setTimeout(() => {
                        BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
                            setPeripheralInfo(peripheralInfo2.set(peripheral.id, peripheralInfo))
                            var service = peripheralInfo.characteristics[3].service;
                            var bakeCharacteristic = peripheralInfo.characteristics[3].characteristic;

                            if (!_.has(deviceObje, peripheral.id)) {
                                deviceObje[peripheral.id] = []
                            }
                            setTimeout(() => {
                                BleManager.startNotification(peripheral.id, service, bakeCharacteristic, peripheral.name).then(
                                    () => {
                                        dive.setIdDispositivo(peripheral.id)
                                        dive.setMacaddres(peripheral.id)
                                        dive.setserviceuuids(service)
                                        dive.setcaracteristica(bakeCharacteristic)
                                        adddivice()
                                    }).catch((error) => {
                                        console.log('Notification error', error);
                                    });
                            }, 1000);
                        });
                    }, 1500);
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
                            {realTime && (
                                <TouchableOpacity
                                    onPress={() => disconect()}
                                    style={Styles.appButtonContainer}
                                >
                                    <Text
                                        style={
                                            Styles.appButtonText}
                                    >
                                        Terminar Experimento
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