import {
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';

const RevardedAdId = 'ca-app-pub-4325774723386556/1545730356';

const rewardedAd = RewardedAd.createForAdRequest(RevardedAdId);

export const showRewardedAd = () => {
  const unsubscribeLoaded = rewardedAd.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      rewardedAd.show();
    },
  );
  const unsubscribeEarned = rewardedAd.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    reward => {
      console.log('User earned reward of', reward);
    },
  );

  rewardedAd.load();

  return () => {
    unsubscribeLoaded();
    unsubscribeEarned();
  };
};
