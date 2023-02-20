import React from 'react';
import { View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const QrFrame = () => {
  const FRAME_COLOR = '#ECDBBA';

  return (
    <View
      style={{
        height: hp(30),
        width: hp(30),
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          width: hp(30),
          height: hp(10),
          borderColor: FRAME_COLOR,
          borderLeftWidth: 4,
          borderRightWidth: 4,
        }}
      />
      <View
        style={{
          width: hp(30),
          height: hp(10),
        }}
      />
      <View
        style={{
          width: hp(30),
          height: hp(10),
          borderColor: FRAME_COLOR,
          borderLeftWidth: 4,
          borderRightWidth: 4,
        }}
      />
      <View
        style={{
          width: hp(30),
          height: hp(30),
          flexDirection: 'row',
          position: 'absolute',
        }}>
        <View
          style={{
            height: hp(30),
            width: hp(10),
            borderColor: FRAME_COLOR,
            borderTopWidth: 4,
            borderBottomWidth: 4,
          }}
        />
        <View
          style={{
            height: hp(30),
            width: hp(10),
          }}
        />
        <View
          style={{
            height: hp(30),
            width: hp(10),
            borderColor: FRAME_COLOR,
            borderTopWidth: 4,
            borderBottomWidth: 4,
          }}
        />
      </View>
    </View>
  );
};

export default QrFrame;
