import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { updateReceipt } from '../../store/reducer/receipt';
import { updateDiners } from '../../store/reducer/diners';
import Grid from 'react-native-grid-component';

class OrderConfirm04 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diners: [],
      selTip: 0,
    };
    this.setTip = this.setTip.bind(this);
    this.renderListDiner = this.renderListDiner.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    const copyOfDiners = this.props.diners.map(elem => {
      return {
        name: elem.name,
        total: elem.total,
        phone: elem.phone,
        items: elem.items,
        venmo: elem.venmo,
      };
    });
    this.setState({ diners: copyOfDiners });
  }

  async setTip(selectedTip) {
    await this.setState({ selTip: selectedTip });
    let copyOfDiners = this.props.diners.map(elem => {
      return {
        name: elem.name,
        total: elem.total,
        phone: elem.phone,
        items: elem.items,
        venmo: elem.venmo,
      };
    });
    await copyOfDiners.map(elem => {
      const dinerTipAmt = elem.total * (this.state.selTip / 100);
      const dinersTaxAmt =
        elem.total * (this.props.receipt.tax / this.props.receipt.totalpreTax);
      const newDinerTtl = elem.total + dinersTaxAmt + dinerTipAmt;
      elem.total = newDinerTtl;
      return elem;
    });
    await this.setState({ diners: copyOfDiners });
  }

  async handleSubmit() {
    await this.props.updateDiners(this.state.diners);
    this.props.navigation.navigate('Final05');
  }

  renderListDiner = item => {
    return (
      <View style={styles.dinercompView}>
        <Text style={styles.youText}>{item.name}</Text>
        <Text style={styles.textFourText}>
          ${parseFloat(Math.round(item.total * 100) / 100).toFixed(2)}
        </Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.tipReviewText}>tip and review</Text>
        <Text style={styles.setATipText}>set a tip</Text>
        <View style={styles.viewView}>
          <View
            pointerEvents="box-none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 55,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <TouchableOpacity
              onPress={() => this.setTip(18)}
              style={styles.tipButton}
            >
              <Text style={styles.tipButtonText}>18%</Text>
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
              }}
            />
            <TouchableOpacity
              onPress={() => this.setTip(22)}
              style={styles.tipThreeButton}
            >
              <Text style={styles.tipThreeButtonText}>22%</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => this.setTip(20)}
            style={styles.tipTwoButton}
          >
            <Text style={styles.tipTwoButtonText}>20%</Text>
          </TouchableOpacity>
        </View>
        {this.state.selTip ? (
          <View style={{ flex: 1 }}>
            <Text style={styles.setATipText}>with tax and tip</Text>
            <Grid
              style={styles.dinerList}
              keyExtractor={(item, index) => 'key' + index}
              renderItem={this.renderListDiner}
              data={this.state.diners}
              numColumns={2}
            />
            <TouchableOpacity
              onPress={() => this.handleSubmit()}
              style={styles.confirmbtnButton}
            >
              <Text style={styles.confirmbtnButtonText}>confirm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
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
  tipReviewText: {
    color: 'rgb(213, 213, 214)',
    fontSize: 50,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginTop: 61,
  },
  setATipText: {
    backgroundColor: 'transparent',
    color: 'rgb(158, 138, 153)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginTop: 59,
  },
  viewView: {
    backgroundColor: 'transparent',
    width: 306,
    height: 55,
    marginTop: 33,
  },
  tipButton: {
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
  },
  tipButtonText: {
    color: 'rgb(171, 171, 171)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  tipButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  tipThreeButton: {
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
  },
  tipThreeButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  tipThreeButtonText: {
    color: 'rgb(171, 171, 171)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  tipTwoButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  tipTwoButton: {
    backgroundColor: 'rgb(255, 244, 201)',
    borderRadius: 14,
    shadowColor: 'rgb(214, 214, 214)',
    shadowRadius: 6,
    shadowOpacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    position: 'absolute',
    alignSelf: 'center',
    width: 86,
    top: 0,
    height: 55,
  },
  tipTwoButtonText: {
    color: 'rgb(171, 171, 171)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  dinerList: {
    flex: 1,
    marginTop: 25,
    marginBottom: 10,
    maxHeight: 190,
  },
  dinerrowView: {
    backgroundColor: 'transparent',
    width: 322,
    height: 90,
    marginTop: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dinercompView: {
    backgroundColor: 'rgb(242, 235, 241)',
    borderRadius: 14,
    width: 159,
    height: 90,
    marginTop: 5,
    marginLeft: 5,
  },
  youText: {
    color: 'rgb(255, 65, 32)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 30,
    right: 30,
    top: 21,
  },
  textFourText: {
    color: 'rgb(158, 138, 153)',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 30,
    right: 30,
    top: 43,
  },
  confirmbtnButton: {
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
    marginTop: 5,
    marginBottom: 140,
    marginLeft: 60,
  },
  confirmbtnButtonText: {
    color: 'rgb(150, 177, 151)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  confirmbtnButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
});

const mapStateToProps = state => {
  return {
    receipt: state.receipt,
    diners: state.diners.diners,
  };
};

const mapDispatchToProps = dispatch => ({
  updateReceipt: updatedInfo => dispatch(updateReceipt(updatedInfo)),
  updateDiners: diners => dispatch(updateDiners(diners)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderConfirm04);
