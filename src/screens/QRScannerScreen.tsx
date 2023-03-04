/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  Barcode,
  BarcodeFormat,
  scanBarcodes,
} from 'vision-camera-code-scanner';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { runOnJS } from 'react-native-reanimated';
import QrFrame from '../components/QrFrame';
import ScanResultAlert from '../components/ScanResultAlert';
import Torch from '../components/Torch';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectScanQrFps, setScanQrFps } from '../redux/slices/scanQrFpsSlice';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../App';

const QRScannerScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const dispatch = useAppDispatch();
  const scanQrFps = useAppSelector(selectScanQrFps);

  const devices = useCameraDevices();
  const device = devices.back;

  const [qrResult, setQrResult] = React.useState<string>('');
  const [hasPermission, setHasPermission] = React.useState(false);
  const [qrResultAlert, setQrResultAlert] = React.useState<-1 | 0>(0);
  const [torch, setTorch] = React.useState<'on' | 'off'>('off');
  let torchCounter = 0;

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const setBarcodes = (detectedBarcodes: Barcode[]) => {
    if (detectedBarcodes[0]?.displayValue !== undefined) {
      setQrResult(detectedBarcodes[0].displayValue);
      dispatch(setScanQrFps({ scanQrFps: 0 }));
      setQrResultAlert(0);
    } else if (
      qrResult !== '' &&
      detectedBarcodes[0]?.displayValue === undefined
    ) {
      setQrResult('');
      dispatch(setScanQrFps({ scanQrFps: 2 }));
      setQrResultAlert(-1);
    }
  };

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.ALL_FORMATS], {
      checkInverted: true,
    });
    runOnJS(setBarcodes)(detectedBarcodes);
  }, []);

  const toggleTorch = () => {
    torchCounter = torchCounter + 1;
    if (torchCounter % 2 === 1) {
      setTorch('on');
    } else {
      setTorch('off');
    }
  };

  if (device != null && hasPermission) {
    return (
      <>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          torch={torch}
          isActive={true}
          focusable
          frameProcessor={frameProcessor}
          frameProcessorFps={scanQrFps}
        />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ width: 30, height: 30 }}></View>
            {scanQrFps === 0 ? (
              <ScanResultAlert
                result={qrResult}
                animateOffset={qrResultAlert}
              />
            ) : null}
            <TouchableOpacity
              style={styles.qrGenerationNavigateButton}
              onPress={() => navigation.navigate('QRGeneratorScreen')}>
              <Ionicons name="qr-code" color="white" size={hp(3)} />
            </TouchableOpacity>
          </View>
          {/* Body */}
          <View style={styles.body}>
            <QrFrame />
          </View>
          {/* Footer */}
          <View style={styles.footer}>
            <Torch torch={torch} toggleTorch={toggleTorch} />
          </View>
        </View>
      </>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: '#000',
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      <Text style={{ fontFamily: 'Roboto-Bold', color: '#FFFF' }}>
        Please set camera permission in settings
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: hp(15),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    height: hp(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    height: hp(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrGenerationNavigateButton: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
});

export default QRScannerScreen;
