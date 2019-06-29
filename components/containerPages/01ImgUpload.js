import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ImagePickerIOS,
  Image,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { getImage, postProcessReceipt } from '../../store/reducer/receipt';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

class ImgUpload01 extends React.Component {
  constructor() {
    super();
    this.state = {
      image: null,
    };
    this.pickImage = this.pickImage.bind(this);
  }

  componentDidMount() {
    this.setState({ image: this.props.image });
  }

  async pickImage() {
    const newPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    const newimgPic = await ImagePicker.launchImageLibraryAsync({
      base64: true,
    });
    console.log(
      Object.keys(newimgPic),
      newimgPic.uri,
      'base',
      newimgPic.base64.slice(0, 100)
    );
    // ImagePickerIOS.openSelectDialog(
    //   {},
    //   async imageUri => {
    await this.props.getImage(newimgPic.uri);
    await this.setState({ image: this.props.image });
    await this.props.postProcessReceipt(newimgPic.base64);
    //   },
    //   error => console.error(error)
    // );
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('../../assets/imageAssets/lazySuzeLogo.png')}
          style={styles.lazysuzelogoImage}
        />
        <Text style={styles.stepOneText}>step one</Text>
        <Text style={styles.pickAReceiptText}>pick a receipt</Text>
        <View
          pointerEvents="box-none"
          style={{
            alignSelf: 'stretch',
            height: 57,
            marginLeft: 106,
            marginRight: 109,
            marginTop: 30,
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <TouchableOpacity style={styles.groupButton}>
            <Image
              source={require('../../assets/imageAssets/newCamera.png')}
              style={styles.groupButtonImage}
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
            }}
          />
          <TouchableOpacity
            onPress={() => this.pickImage()}
            style={styles.group2Button}
          >
            <Image
              source={require('../../assets/imageAssets/cloudNew.png')}
              style={styles.group2ButtonImage}
            />
          </TouchableOpacity>
        </View>
        {this.props.image ? (
          <View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('SetDiners02', {
                  image: this.state.image,
                })
              }
              style={styles.group3Button}
            >
              <Text style={styles.group3ButtonText}>set diners</Text>
            </TouchableOpacity>
            <Image
              style={styles.screenShot20190622At110411AmImage}
              source={{ uri: this.props.image }}
            />
          </View>
        ) : null}
        <View
          style={{
            flex: 1,
          }}
        />
        <Image
          source={require('../../assets/imageAssets/spinnerLogo.png')}
          style={styles.spinnerlogoImage}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
  },
  lazysuzelogoImage: {
    backgroundColor: 'transparent',
    resizeMode: 'center',
    width: 139,
    height: 115,
    marginTop: 57,
  },
  stepOneText: {
    backgroundColor: 'transparent',
    color: 'rgb(213, 213, 214)',
    fontSize: 50,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 64,
  },
  pickAReceiptText: {
    backgroundColor: 'transparent',
    color: 'rgb(158, 138, 153)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 11,
  },
  groupButton: {
    backgroundColor: 'rgb(255, 244, 201)',
    borderRadius: 14,
    shadowColor: 'rgb(214, 214, 214)',
    shadowRadius: 6,
    shadowOpacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: 86,
    height: 55,
    marginTop: 2,
  },
  groupButtonImage: {
    resizeMode: 'contain',
  },
  groupButtonText: {
    color: 'black',
    fontFamily: '.SFNSText',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
  },
  group2ButtonText: {
    color: 'black',
    fontFamily: '.SFNSText',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
  },
  group2Button: {
    backgroundColor: 'rgb(252, 238, 186)',
    borderRadius: 14,
    shadowColor: 'rgb(214, 214, 214)',
    shadowRadius: 6,
    shadowOpacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: 86,
    height: 57,
  },
  group2ButtonImage: {
    resizeMode: 'contain',
  },
  group3Button: {
    backgroundColor: 'rgb(238, 255, 235)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgb(159, 227, 160)',
    borderStyle: 'solid',
    shadowColor: 'rgb(214, 214, 214)',
    shadowRadius: 6,
    shadowOpacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: 199,
    height: 42,
    marginTop: 21,
  },
  group3ButtonText: {
    color: 'rgb(150, 177, 151)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  group3ButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  screenShot20190622At110411AmImage: {
    backgroundColor: 'transparent',
    resizeMode: 'contain',
    width: 92,
    height: 177,
    marginTop: 15,
    marginLeft: 50,
  },
  spinnerlogoImage: {
    resizeMode: 'center',
    backgroundColor: 'transparent',
    width: 75,
    height: 79,
    marginBottom: 37,
  },
});

const mapStateToProps = state => {
  return {
    image: state.receipt.image,
  };
};

const mapDispatchToProps = dispatch => ({
  getImage: imgUri => dispatch(getImage(imgUri)),
  postProcessReceipt: imageUri => dispatch(postProcessReceipt(imageUri)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImgUpload01);
