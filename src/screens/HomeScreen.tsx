/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, StyleSheet } from 'react-native';
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
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { runOnJS } from 'react-native-reanimated';
import QrFrame from '../components/QrFrame';
import ScanResultAlert from '../components/ScanResultAlert';
import Torch from '../components/Torch';

const HomeScreen = () => {
  const devices = useCameraDevices();
  const device = devices.back;
  const [scanQrFps, setScanQrFps] = React.useState<0 | 2>(2);
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
      console.log('a');
      setQrResult(detectedBarcodes[0].displayValue);
      setScanQrFps(0);
      setQrResultAlert(0);
    } else if (
      qrResult !== '' &&
      detectedBarcodes[0]?.displayValue === undefined
    ) {
      console.log('b');
      setQrResult('');
      setScanQrFps(2);
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

  return (
    device != null &&
    hasPermission && (
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
            {scanQrFps === 0 ? (
              <ScanResultAlert
                result={qrResult}
                animateOffset={qrResultAlert}
              />
            ) : null}
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
    )
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: hp(15),
    justifyContent: 'center',
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
});

export default HomeScreen;
