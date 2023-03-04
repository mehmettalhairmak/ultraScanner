import { AdEventType, InterstitialAd, TestIds } from "react-native-google-mobile-ads";

const interstitialAd = InterstitialAd.createForAdRequest(
    TestIds.INTERSTITIAL,
  );

export const showInterstitialAd = () => {
    const unsubscribe = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitialAd.show();
      },
    );
    interstitialAd.load();

    return unsubscribe;
  };