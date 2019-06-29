import { createAppContainer, createStackNavigator } from 'react-navigation';
import ImgUpload01 from './components/containerPages/01ImgUpload';
import SetDiners02 from './components/containerPages/02setDiners';
import ConfigRec03 from './components/containerPages/03configureReceipt';
import OrderConfirm04 from './components/containerPages/04orderConfirm';
import Final05 from './components/containerPages/05finalPage';

const AppNavigator = createStackNavigator({
  ImgUpload01: { screen: ImgUpload01 },
  SetDiners02: { screen: SetDiners02 },
  ConfigRec03: { screen: ConfigRec03 },
  OrderConfirm04: { screen: OrderConfirm04 },
  Final05: { screen: Final05 },
});

AppContainer = createAppContainer(AppNavigator)

export default AppContainer;
