import { RewardedAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads";

const rewardedAd = RewardedAd.createForAdRequest(TestIds.REWARDED);

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