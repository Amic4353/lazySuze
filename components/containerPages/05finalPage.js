import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Communications from 'react-native-communications';
import { connect } from 'react-redux';
import { resetingReceipt } from '../../store/reducer/receipt';
import { updateDiners } from '../../store/reducer/diners';

class Final05 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diners: [],
      me: {},
    };
    this.handleComplete = this.handleComplete.bind(this);
  }

  componentDidMount() {
    let billPayer = {};
    const copyOfDiners = this.props.diners.filter(elem => {
      if (elem.name === 'Me') {
        billPayer = elem;
      } else {
        return {
          name: elem.name,
          total: elem.total,
          phone: elem.phone,
          items: elem.items,
          venmo: elem.venmo,
        };
      }
    });
    this.setState({
      diners: copyOfDiners,
      me: billPayer,
    });
  }

  async handleText(diner) {
    console.log(diner);
    await Communications.text(
      diner.phone,
      `$${parseFloat(Math.round(diner.total * 100) / 100).toFixed(
        2
      )}, ${diner.items.join()}, venmo: ${this.state.me.venmo}`
    );
    const didNotText = this.state.diners.filter(elem => {
      if (elem.name !== diner.name) {
        return elem;
      }
    });
    this.setState({ diners: didNotText });
  }

  async handleComplete() {
    const clearedDiners = [
      {
        name: 'Me',
        phone: '5126531206',
        total: 0,
        items: [],
        venmo: 'https://venmo.com/code?user_id=1499309883260928941',
      },
    ];
    await this.props.resetingReceipt();
    await this.props.updateDiners(clearedDiners);
    await this.props.navigation.navigate('ImgUpload01');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.iphoneXrView}>
          <Text style={styles.allSetText}>all set</Text>
          <View style={styles.messagecompView}>
            {this.state.diners.map((elem, indx) => {
              if (elem.phone === '') {
                return (
                  <Text key={indx} style={styles.setdinersbtnButtonText}>
                    {elem.name} - $
                    {parseFloat(Math.round(elem.total * 100) / 100).toFixed(2)}
                  </Text>
                );
              } else {
                return (
                  <TouchableOpacity
                    key={indx}
                    onPress={() => this.handleText(elem)}
                    style={styles.setdinersbtnButton}
                  >
                    <Text style={styles.textToBobTotalText}>
                      text {elem.name} - $
                      {parseFloat(Math.round(elem.total * 100) / 100).toFixed(
                        2
                      )}
                    </Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>
          <TouchableOpacity
            style={styles.homebuttonImage}
            onPress={() => this.handleComplete()}
          >
            <Image
              source={require('../../assets/imageAssets/homeButton.jpg')}
              style={styles.homebuttonImage}
            />
          </TouchableOpacity>
        </View>
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
  allSetText: {
    backgroundColor: 'transparent',
    color: 'rgb(213, 213, 214)',
    fontSize: 50,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 161,
  },
  messagecompView: {
    backgroundColor: 'transparent',
    width: 249,
    height: 91,
    marginTop: 130,
  },
  textToBobTotalText: {
    backgroundColor: 'transparent',
    color: 'rgb(150, 177, 151)',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginLeft: 25,
    marginRight: 25,
  },
  setdinersbtnButtonText: {
    color: 'rgb(150, 177, 151)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  setdinersbtnButton: {
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
    height: 42,
  },
  setdinersbtnButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  homebuttonImage: {
    backgroundColor: 'transparent',
    resizeMode: 'center',
    alignSelf: 'center',
    width: 79,
    height: 79,
    marginBottom: 37,
  },
});

const mapStateToProps = state => {
  return {
    diners: state.diners.diners,
  };
};

const mapDispatchToProps = dispatch => ({
  resetingReceipt: () => dispatch(resetingReceipt()),
  updateDiners: diners => dispatch(updateDiners(diners)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Final05);
