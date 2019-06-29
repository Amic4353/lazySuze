import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { connect } from 'react-redux';
import { addNewDiner, updateDiners } from '../../store/reducer/diners';
import { TextInput } from 'react-native-gesture-handler';

class SetDiners02 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diners: [],
      name: '',
      phone: '',
      total: 0,
      items: [],
      venmo: '',
    };
    this.handleComplete = this.handleComplete.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }
  componentDidMount() {
    console.log(this.props.diners);
    this.setState({ diners: this.props.diners });
  }

  handleDelete(deletedName) {
    try {
      let dinerDeleted = this.state.diners.filter(elem => {
        if (elem.name !== deletedName) {
          return elem;
        }
      });
      this.setState({ diners: dinerDeleted });
    } catch (error) {
      console.log('Error deleting diner: ', error);
    }
  }

  handleAdd() {
    try {
      if (this.state.name === '') {
        Alert.alert('Alert', 'Name must be entered');
        return;
      } else {
        const newDiner = {
          name: this.state.name,
          phone: this.state.phone,
          total: this.state.total,
          items: this.state.items,
          venmo: this.state.venmo,
        };
        let newAllDiners = this.state.diners.slice();
        newAllDiners.push(newDiner);
        this.setState({ diners: newAllDiners });
        this.setState({ name: '', phone: '', total: 0, items: [] });
      }
    } catch (err) {
      console.log('Error from adding new diner: ', err);
    }
  }

  async handleComplete() {
    try {
      await this.props.updateDiners(this.state.diners);
      this.props.navigation.navigate('ConfigRec03');
    } catch (error) {
      console.log('Error submitting final diners: ', error);
    }
  }

  async handleBack() {
    try {
      await this.props.updateDiners(this.state.diners);
      this.props.navigation.navigate('ImgUpload01');
    } catch (error) {
      console.log('Error setting state when pressing Back: ', error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.setDinersText}>set diners</Text>
        <Text style={styles.dinersText}>diners</Text>
        <ScrollView style={styles.dinersScrollView}>
          {this.state.diners.map((diner, indx) => {
            return (
              <View style={styles.dinerlineView} key={indx}>
                <View style={styles.dinerbubbleView}>
                  <Text style={styles.meText}>{diner.name}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                  }}
                />
                <TouchableOpacity
                  onPress={() => this.handleDelete(diner.name)}
                  style={styles.ovalButton}
                />
              </View>
            );
          })}
        </ScrollView>
        <TextInput
          autoCorrect={false}
          placeholder="name(required)"
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
          style={styles.nametextinputTextInput}
        />
        <TextInput
          autoCorrect={false}
          placeholder="phone #"
          style={styles.phonetextinputTextInput}
          onChangeText={phone => this.setState({ phone })}
          value={this.state.phone}
        />
        <TouchableOpacity
          onPress={() => this.handleAdd()}
          style={styles.adddinerbtnButton}
        >
          <Text style={styles.adddinerbtnButtonText}>add diner</Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
          }}
        />

        {this.state.diners.length > 1 ? (
          <TouchableOpacity
            onPress={() => this.handleComplete()}
            style={styles.setdinersbtnButton}
          >
            <Text style={styles.setdinersbtnButtonText}>split check</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <TouchableOpacity
          onPress={() => this.handleBack()}
          style={styles.homebuttonImage}
        >
          <Image
            source={require('../../assets/imageAssets/homeButton.jpg')}
            style={styles.homebuttonImage}
          />
        </TouchableOpacity>
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
  setDinersText: {
    color: 'rgb(213, 213, 214)',
    fontSize: 50,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginTop: 57,
  },
  dinersText: {
    backgroundColor: 'transparent',
    color: 'rgb(158, 138, 153)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    alignSelf: 'flex-start',
    marginLeft: 98,
    marginTop: 23,
  },
  dinersScrollView: {
    height: 80,
  },
  dinerlineView: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    width: 223,
    height: 35,
    marginRight: 94,
    marginLeft: 94,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dinerbubbleView: {
    backgroundColor: 'rgba(224, 204, 220, 0.4)',
    borderRadius: 17,
    width: 179,
    height: 35,
    justifyContent: 'center',
  },
  meText: {
    backgroundColor: 'transparent',
    color: 'rgb(158, 138, 153)',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginLeft: 14,
    marginRight: 14,
  },
  ovalButtonText: {
    color: 'black',
    fontFamily: '.SFNSText',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
  },
  ovalButtonImage: {
    resizeMode: 'contain',
  },
  ovalButton: {
    backgroundColor: 'rgb(255, 65, 32)',
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: 34,
    height: 34,
  },
  rectangleView: {
    backgroundColor: 'rgba(224, 204, 220, 0.4)',
    borderRadius: 17,
    position: 'absolute',
    left: 0,
    width: 179,
    top: 0,
    height: 35,
  },
  diner2Text: {
    backgroundColor: 'transparent',
    color: 'rgb(158, 138, 153)',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    position: 'absolute',
    left: 55,
    top: 6,
  },
  ovalView: {
    backgroundColor: 'rgb(255, 65, 32)',
    borderRadius: 17,
    width: 34,
    height: 34,
  },
  nametextinputTextInput: {
    backgroundColor: 'rgba(216, 216, 216, 0.2)',
    borderWidth: 1,
    borderColor: 'rgb(151, 151, 151)',
    borderStyle: 'solid',
    padding: 0,
    color: 'rgb(171, 171, 171)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    alignSelf: 'flex-end',
    width: 223,
    height: 42,
    marginRight: 93,
    marginTop: 54,
  },
  phonetextinputTextInput: {
    backgroundColor: 'rgba(216, 216, 216, 0.2)',
    borderWidth: 1,
    borderColor: 'rgb(151, 151, 151)',
    borderStyle: 'solid',
    padding: 0,
    color: 'rgb(171, 171, 171)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    alignSelf: 'flex-end',
    width: 223,
    height: 42,
    marginRight: 93,
    marginTop: 10,
  },
  adddinerbtnButton: {
    backgroundColor: 'rgb(243, 235, 241)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgb(159, 139, 154)',
    borderStyle: 'solid',
    shadowColor: 'rgb(214, 214, 214)',
    shadowRadius: 6,
    shadowOpacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: 129,
    height: 42,
    marginTop: 15,
    marginBottom: 10,
  },
  adddinerbtnButtonText: {
    color: 'rgb(158, 138, 153)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  adddinerbtnButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  setdinersbtnButtonText: {
    color: 'rgb(150, 177, 151)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
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
    width: 199,
    height: 42,
    marginBottom: 50,
  },
  setdinersbtnButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  homebuttonImage: {
    backgroundColor: 'transparent',
    resizeMode: 'center',
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
  addNewDiner: newDiner => dispatch(addNewDiner(newDiner)),
  updateDiners: diners => dispatch(updateDiners(diners)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SetDiners02);
