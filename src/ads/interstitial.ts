import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';

const InterstitialAdId = 'ca-app-pub-4325774723386556/6361274465';

const interstitialAd = InterstitialAd.createForAdRequest(InterstitialAdId);

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
