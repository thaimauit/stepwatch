# run ios
  # install 
      yarn install
  # install pod
      npx pod-install // or cd ios && pod install
  # build debug
      npx react-native run-ios --scheme "develop" --simulator "iPhone 11"
# run android
  # install 
      yarn install
  # build debug
      npx react-native run-android --variant=devDebug --appIdSuffix=development
