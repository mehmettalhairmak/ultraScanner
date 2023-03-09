import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  ToastAndroid,
  PermissionsAndroid,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Toast from 'react-native-toast-message';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParams } from '../../App';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { showInterstitialAd } from '../ads/interstitial';
import { showRewardedAd } from '../ads/rewarded';
import i18next from 'i18next';
import { QRGeneratorScreenBannerAdId } from '../ads/banner';

const QRGeneratorScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();

  let qrRef: any;
  const [qrCodeName, setQrCodeName] = React.useState('');
  const [qrCodeValue, setQrCodeValue] = React.useState('');

  const [nameInputValidation, setNameInputValidation] = React.useState(false);
  const [contentInputValidation, setContentInputValidation] =
    React.useState(false);

  React.useEffect(() => {
    showInterstitialAd();
  }, []);

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const nameOnChangeText = (value: string) => {
    setQrCodeName(value);
    if (value.length < 1) {
      setNameInputValidation(false);
    } else {
      setNameInputValidation(true);
    }
  };

  const contentOnChangeText = (value: string) => {
    setQrCodeValue(value);
    if (value.length < 1) {
      setContentInputValidation(false);
    } else {
      setContentInputValidation(true);
    }
  };

  const onSave = async () => {
    if (!nameInputValidation || !contentInputValidation) {
      Toast.show({
        type: 'error',
        text1: i18next.t<string>('PleaseFillInAllFields'),
        position: 'bottom',
      });
    } else {
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return;
      }

      showRewardedAd();

      qrRef.toDataURL((data: any) => {
        let filePath = RNFS.CachesDirectoryPath + `/${qrCodeName}.png`;
        RNFS.writeFile(filePath, data, 'base64')
          .then(success => {
            return CameraRoll.save(filePath, {
              type: 'photo',
              album: 'Ultra Scanner',
            });
          })
          .then(() => {
            ToastAndroid.show(
              i18next.t('QRCodeSavedToGallery'),
              ToastAndroid.LONG,
            );
          });
      });
    }
  };

  const onShare = () => {
    if (!nameInputValidation || !contentInputValidation) {
      Toast.show({
        type: 'error',
        text1: i18next.t<string>('PleaseFillInAllFields'),
        position: 'bottom',
      });
    } else {
      showRewardedAd();

      qrRef.toDataURL((url: any) => {
        let shareImageBase64 = {
          showAppsToView: true,
          url: `data:image/png;base64,${url}`,
        };
        Share.open(shareImageBase64).catch(error => console.log(error));
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 30, height: 30 }} />
        <TouchableOpacity
          style={styles.headerNavigateButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color="white" size={hp(3)} />
        </TouchableOpacity>
      </View>
      {/* QR Content */}
      <View
        style={{
          height: hp(30),
          width: wp(100),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {qrCodeValue !== '' ? (
          <QRCode
            value={qrCodeValue}
            size={hp(20)}
            logoSize={50}
            getRef={c => (qrRef = c)}
          />
        ) : null}
      </View>
      {/* Input Content */}
      <View style={styles.inputContent}>
        {/* Input Name */}
        <View>
          <Text
            style={[
              styles.inputLabel,
              { color: nameInputValidation ? '#FFFF' : 'red' },
            ]}>
            {i18next.t('FileName')}*
          </Text>
          <View
            style={[
              styles.inputView,
              { borderColor: nameInputValidation ? '#FFFF' : 'red' },
            ]}>
            <TextInput
              value={qrCodeName}
              onChangeText={nameOnChangeText}
              style={{ padding: wp(2), color: '#FFFF' }}
            />
          </View>
        </View>
        {/* Input Content */}
        <View>
          <Text
            style={[
              styles.inputLabel,
              { color: contentInputValidation ? '#FFFF' : 'red' },
            ]}>
            {i18next.t('QRContent')}*
          </Text>
          <View
            style={[
              styles.inputView,
              { borderColor: contentInputValidation ? '#FFFF' : 'red' },
            ]}>
            <TextInput
              value={qrCodeValue}
              onChangeText={contentOnChangeText}
              style={{ padding: wp(2), color: '#FFFF' }}
            />
          </View>
        </View>
        {/* Button Save */}
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.buttonSave} onPress={onSave}>
            <Text style={{ color: '#000', fontFamily: 'Roboto-Bold' }}>
              {i18next.t('Save')}
            </Text>
          </TouchableOpacity>
          {/* Button Share */}
          <TouchableOpacity style={styles.buttonShare} onPress={onShare}>
            <Text style={{ color: '#FFFF', fontFamily: 'Roboto-Bold' }}>
              {i18next.t('Share')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <BannerAd
          unitId={QRGeneratorScreenBannerAdId}
          size={BannerAdSize.FULL_BANNER}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2D4263',
  },
  header: {
    height: hp(15),
    paddingHorizontal: wp(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerNavigateButton: {
    width: hp(5),
    height: hp(5),
    borderRadius: hp(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  inputContent: {
    width: wp(100),
    alignItems: 'center',
    gap: hp(4),
  },
  inputLabel: {
    marginLeft: wp(3),
    fontFamily: 'Roboto-Bold',
  },
  inputView: {
    borderWidth: 1,
    width: wp(90),
    borderRadius: wp(50),
  },
  buttonSave: {
    width: wp(35),
    height: hp(8),
    borderTopLeftRadius: wp(50),
    borderBottomLeftRadius: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFF',
  },
  buttonShare: {
    width: wp(35),
    height: hp(8),
    borderTopRightRadius: wp(50),
    borderBottomRightRadius: wp(50),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
});

export default QRGeneratorScreen;
