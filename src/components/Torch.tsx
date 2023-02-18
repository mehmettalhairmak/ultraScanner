import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface TorchProps {
  torch: 'on' | 'off';
  toggleTorch: () => void;
}

const Torch: React.FC<TorchProps> = ({ torch, toggleTorch }) => {
  return (
    <TouchableOpacity
      onPress={toggleTorch}
      style={{
        width: hp(8),
        height: hp(8),
        borderRadius: hp(4),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: torch === 'off' ? '#2D4263' : '#ECDBBA',
      }}>
      <Ionicons
        name={torch === 'off' ? 'flash' : 'flash-off'}
        size={hp(3)}
        color={torch === 'off' ? '#ECDBBA' : '#2D4263'}
      />
    </TouchableOpacity>
  );
};

export default Torch;
