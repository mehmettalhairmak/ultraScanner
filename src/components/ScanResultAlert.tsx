import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useAppDispatch } from '../hooks';
import { setScanQrFps } from '../redux/slices/scanQrFpsSlice';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { showRewardedAd } from '../ads/rewarded';
import i18next from 'i18next';
import InAppReview from 'react-native-in-app-review';

interface ScanResultAlertProps {
  result: string;
  animateOffset: number;
}

type GestureContext = {
  translateX: number;
};

const ScanResultAlert: React.FC<ScanResultAlertProps> = ({
  result,
  animateOffset,
}) => {
  const dispatch = useAppDispatch();

  const offset = useSharedValue(-1);
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    offset.value = animateOffset;
  }, [animateOffset]);

  const springStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(offset.value * 255) }],
    };
  });

  const changeFpsOnDrag = (data: 2 | 0) => {
    dispatch(setScanQrFps({ scanQrFps: data }));
  };

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart(event, context) {
      context.translateX = translateX.value;
    },
    onActive(event, context) {
      translateX.value = event.translationX;
      context.translateX = event.translationX;
    },
    onFinish(event, context, isCanceledOrFailed) {
      if (context.translateX >= 100) {
        translateX.value = withSpring(500);
      } else if (context.translateX <= -100) {
        translateX.value = withSpring(-500);
      } else {
        translateX.value = withSpring(0);
      }

      if (context.translateX >= 100 || context.translateX <= -100) {
        runOnJS(changeFpsOnDrag)(2);
      }
    },
  });

  const xDragStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const titleOnPressAction = async () => {
    const supportLinking = await Linking.canOpenURL(result);
    if (supportLinking) {
      await Linking.openURL(result);
    } else {
      showRewardedAd();
      Clipboard.setString(result);
      Toast.show({
        type: 'success',
        text1: i18next.t<string>('CopiedTextToClipboard'),
        position: 'bottom',
      });
    }
  };

  const titleOnPress = async () => {
    if (InAppReview.isAvailable()) {
      InAppReview.RequestInAppReview()
        .then(async hasFlowFinishedSuccessfully => {
          if (hasFlowFinishedSuccessfully) {
            await titleOnPressAction();
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      await titleOnPressAction();
    }
  };

  return (
    <PanGestureHandler onGestureEvent={panGestureEvent}>
      <Animated.View style={[styles.container, springStyle, xDragStyle]}>
        <View style={styles.qrField}>
          <QRCode value={result} size={hp(6)} />
        </View>
        <View style={styles.titleField}>
          <TouchableOpacity onPress={titleOnPress}>
            <Text
              style={{ color: '#FFFF', fontFamily: 'Roboto-Bold' }}
              numberOfLines={3}>
              {result}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    width: hp(40),
    height: hp(10),
    borderWidth: 0.5,
    borderRadius: hp(4),
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#FFFF',
    shadowColor: '#0000',
    shadowOpacity: 2,
    shadowRadius: 5,
    elevation: 2,
    backgroundColor: '#191919',
  },
  qrField: {
    marginLeft: hp(2),
  },
  titleField: {
    flex: 1,
    marginHorizontal: hp(2),
  },
});

export default ScanResultAlert;
