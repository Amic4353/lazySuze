import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
// import { ListItem } from 'react-native-elements';
import Grid from 'react-native-grid-component';
import Modal from 'react-native-modal';

import { connect } from 'react-redux';
import { updateReceipt } from '../../store/reducer/receipt';
import { updateDiners } from '../../store/reducer/diners';

class ConfigRec03 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preTaxTotal: 0,
      assignedTotal: 0,
      diners: [],
      itemDetail: [],
      isModalVisible: false,
      selItem: '',
      selPrice: 0,
    };
    this.resetReceipt = this.resetReceipt.bind(this);
    this.renderListItem = this.renderListItem.bind(this);
    this.renderListDiner = this.renderListDiner.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.splitEvenly = this.splitEvenly.bind(this);
    this.completeSplitCheck = this.completeSplitCheck.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleItemSelector = this.handleItemSelector.bind(this);
    this.modalRender = this.modalRender.bind(this);
    this.assignSelectedItm = this.assignSelectedItm.bind(this);
  }
  componentDidMount() {
    try {
      //make copies of props, ES6 arr spread now working
      const copyOfDiners = this.props.diners.map(elem => {
        return {
          name: elem.name,
          total: elem.total,
          phone: elem.phone,
          items: [],
          venmo: elem.venmo,
        };
      });
      const copyOfItems = this.props.receipt.itemDetail.map(elem => {
        return { item: elem.item, quantity: elem.quantity, price: elem.price };
      });
      this.setState({
        preTaxTotal: this.props.receipt.totalpreTax,
        diners: copyOfDiners,
        itemDetail: copyOfItems,
        isModalVisible: false,
      });
    } catch (error) {
      console.log('Error reading receipt image: ', error);
    }
  }
  //for the split evenly btn
  splitEvenly = () => {
    try {
      const evenSplit = this.state.preTaxTotal / this.state.diners.length;
      const mapOfSplitItems = this.state.itemDetail.map(elem => elem.item);
      const splitEvenlyUpdate = this.state.diners.map(elem => {
        elem.total += evenSplit;
        elem.items = elem.items.concat(mapOfSplitItems);
        return elem;
      });
      let updatedAssignTotal =
        this.state.assignedTotal + this.state.preTaxTotal;
      this.setState({ assignedTotal: updatedAssignTotal });
      this.setState({ diners: splitEvenlyUpdate });
      this.setState({ itemDetail: [] });
      this.setState({ preTaxTotal: 0 });
    } catch (error) {
      console.log('Error splitting check evenly: ', error);
    }
  };

  handleItemSelector(itemName, itemPrice) {
    this.setState({
      selItem: itemName,
      selPrice: itemPrice,
    });
    this.toggleModal();
  }

  //helper = to show modal component
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  //helper = to render the modal
  modalRender = (itemName, itemPrice) => {
    return (
      <Modal isVisible={this.state.isModalVisible}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}
        >
          <Text style={styles.modalTitle}>Assign {itemName}</Text>
          {this.state.diners.map((elem, indx) => {
            return (
              <TouchableOpacity
                style={styles.modalBtn}
                key={indx}
                onPress={() =>
                  this.assignSelectedItm(elem.name, itemName, itemPrice)
                }
              >
                <Text style={styles.modalBtnTxt}>{elem.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Modal>
    );
  };

  //helper updates the state from the modal buttons
  async assignSelectedItm(dinerName, itemName, itemPrice) {
    const updatedDiners = this.state.diners.map(elem => {
      if (elem.name === dinerName) {
        elem.items.push(itemName);
        elem.total = Number(elem.total) + Number(itemPrice);
      }
      return elem;
    });
    let updatedItems = this.state.itemDetail.filter(elem => {
      if (itemName !== elem.item) {
        return elem;
      }
    });
    let newTotal = this.state.preTaxTotal - itemPrice;
    let newAssignedTotal = Number(this.state.assignedTotal) + Number(itemPrice);
    await this.setState({
      diners: updatedDiners,
      itemDetail: updatedItems,
      preTaxTotal: newTotal,
      assignedTotal: newAssignedTotal,
    });
    await this.toggleModal();
  }

  //resets the receipt to what is on store
  resetReceipt = () => {
    try {
      const copyOfDiners = this.props.diners.map(elem => {
        return {
          name: elem.name,
          total: elem.total,
          phone: elem.phone,
          items: [],
          venmo: elem.venmo,
        };
      });
      this.setState({
        preTaxTotal: this.props.receipt.totalpreTax,
        diners: copyOfDiners,
        itemDetail: this.props.receipt.itemDetail,
        isModalVisible: false,
        assignedTotal: 0,
      });
    } catch (error) {
      console.log('Error resetting receipt: ', error);
    }
  };
  //final button to save edits to store
  async completeSplitCheck() {
    try {
      await this.props.updateDiners(this.state.diners);
      this.props.navigation.navigate('OrderConfirm04');
    } catch (error) {
      console.log('Error completeing the check: ', error);
    }
  }

  //saves info to store and navigates back
  async handleBack() {
    try {
      await this.props.updateDiners(this.state.diners);
      this.props.navigation.navigate('SetDiners02');
    } catch (error) {
      console.log('Error setting state when pressing Back: ', error);
    }
  }

  //render func for diners
  renderListDiner = item => {
    return (
      <View style={styles.dinercompView}>
        <Text style={styles.youText}>{item.name}</Text>
        <Text style={styles.textSixText}>
          ${parseFloat(Math.round(Number(item.total) * 100) / 100).toFixed(2)}
        </Text>
      </View>
    );
  };
  //render func for receipt items
  renderListItem = item => {
    return (
      <View style={styles.itemlimeTwoView}>
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}
        >
          <View
            pointerEvents="box-none"
            style={{
              height: 35,
              marginRight: 104,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={styles.itemdescriptionTwoView}>
              <Text style={styles.lambTwoText}>{item.item}</Text>
            </View>
            <View
              style={{
                flex: 1,
              }}
            />
            <View style={styles.itemqtyTwoView}>
              <Text style={styles.textThreeText}>{item.quantity}</Text>
            </View>
          </View>
        </View>
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
          }}
        >
          <View
            pointerEvents="box-none"
            style={{
              width: 99,
              height: 35,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <View style={styles.itempriceTwoView}>
              <Text style={styles.textFourText}>
                $
                {parseFloat(Math.round(Number(item.price) * 100) / 100).toFixed(
                  2
                )}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.handleItemSelector(item.item, item.price)}
            >
              <Image
                source={require('../../assets/imageAssets/spinnerLogo.png')}
                style={styles.itemassignbtnTwoImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  //Renders the component
  render() {
    return (
      <View style={styles.container}>
        {this.state.isModalVisible ? (
          this.modalRender(this.state.selItem, this.state.selPrice)
        ) : (
          <View />
        )}
        <Text style={styles.splitCheckText}>split check</Text>
        {this.state.assignedTotal === this.props.receipt.totalpreTax ? (
          <View />
        ) : (
          <View style={styles.receiptinfoView}>
            <Text style={styles.receiptItemsText}>receipt items</Text>
            <View style={styles.itemtitlesView}>
              <Text style={styles.descriptionText}>description</Text>
              <View
                style={{
                  flex: 1,
                }}
              />
              <Text style={styles.qtyText}>qty</Text>
              <Text style={styles.priceText}>price</Text>
            </View>
            {/*flat list for items*/}
            {!this.props.receipt.loading ? (
              <View contentContainerStyle={{ height: 80 }}>
                <FlatList
                  keyExtractor={(item, index) => 'key' + index}
                  data={this.state.itemDetail}
                  renderItem={({ item }) => this.renderListItem(item)}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
        )}
        {this.state.preTaxTotal === 0 ? (
          <Text style={styles.completedTotal}>
            TOTAL - $
            {parseFloat(
              Math.round(this.props.receipt.totalpreTax * 100) / 100
            ).toFixed(2)}
          </Text>
        ) : (
          <View style={styles.currtotalinfoView}>
            <Text style={styles.totalText}>total</Text>
            <View
              pointerEvents="box-none"
              style={{
                height: 36,
                marginTop: 5,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}
            >
              <View style={styles.totalfieldView}>
                <Text style={styles.textFiveText}>
                  $
                  {parseFloat(
                    Math.round(this.state.preTaxTotal * 100) / 100
                  ).toFixed(2)}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                }}
              />
              <TouchableOpacity
                onPress={() => this.splitEvenly()}
                style={styles.evensplitbtnButton}
              >
                <Text style={styles.evensplitbtnButtonText}>
                  split evenly - $
                  {parseFloat(
                    Math.round(
                      ((this.state.preTaxTotal / this.state.diners.length) *
                        100) /
                        100
                    )
                  ).toFixed(2)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/*flat list for diners*/}
        <Grid
          style={styles.dinerList}
          keyExtractor={(item, index) => 'key' + index}
          renderItem={this.renderListDiner}
          data={this.state.diners}
          numColumns={2}
        />
        {this.state.preTaxTotal === 0 ? (
          <View>
            <TouchableOpacity
              onPress={() => this.completeSplitCheck()}
              style={styles.tipconfirmbtnButton}
            >
              <Text style={styles.tipconfirmbtnButtonText}>tip and review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.resetReceipt()}
              style={styles.resetreceiptbtnButton}
            >
              <Text style={styles.resetreceiptbtnButtonText}>
                reset receipt
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => this.resetReceipt()}
            style={styles.resetreceiptbtnButton}
          >
            <Text style={styles.resetreceiptbtnButtonText}>reset receipt</Text>
          </TouchableOpacity>
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
    alignItems: 'flex-end',
  },
  splitCheckText: {
    color: 'rgb(213, 213, 214)',
    fontSize: 50,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginTop: 40,
  },
  completedTotal: {
    marginTop: 40,
    marginBottom: 20,
    color: 'rgb(158, 138, 153)',
    fontSize: 35,
    alignSelf: 'center',
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  receiptinfoView: {
    backgroundColor: 'transparent',
    width: 356,
    height: 143,
    marginRight: 24,
    marginTop: 31,
  },
  receiptItemsText: {
    color: 'rgb(158, 138, 153)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  itemtitlesView: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    width: 298,
    height: 21,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionText: {
    backgroundColor: 'transparent',
    color: 'rgb(150, 176, 150)',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
  },
  qtyText: {
    color: 'rgb(150, 176, 150)',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginRight: 14,
  },
  priceText: {
    color: 'rgb(150, 176, 150)',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    backgroundColor: 'transparent',
  },
  itemList: {},
  itemlimeView: {
    backgroundColor: 'transparent',
    height: 35,
    marginTop: 5,
  },
  itemdescriptionView: {
    backgroundColor: 'rgba(216, 216, 216, 0.3)',
    width: 212,
    height: 35,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  lambText: {
    backgroundColor: 'transparent',
    color: 'rgb(171, 171, 171)',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    marginLeft: 10,
  },
  itemqtyView: {
    backgroundColor: 'rgba(216, 216, 216, 0.3)',
    width: 35,
    height: 35,
    justifyContent: 'center',
  },
  textText: {
    color: 'rgb(171, 171, 171)',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginLeft: 13,
    marginRight: 14,
  },
  itempriceView: {
    backgroundColor: 'rgba(216, 216, 216, 0.4)',
    width: 66,
    height: 35,
    justifyContent: 'center',
  },
  textTwoText: {
    backgroundColor: 'transparent',
    color: 'rgb(171, 171, 171)',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginLeft: 11,
    marginRight: 11,
  },
  itemassignbtnImage: {
    resizeMode: 'center',
    backgroundColor: 'transparent',
    width: 33,
    height: 35,
  },
  itemlimeTwoView: {
    backgroundColor: 'transparent',
    height: 35,
    marginTop: 5,
  },
  itemdescriptionTwoView: {
    backgroundColor: 'rgba(216, 216, 216, 0.3)',
    width: 212,
    height: 35,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  lambTwoText: {
    color: 'rgb(171, 171, 171)',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    backgroundColor: 'transparent',
    marginLeft: 10,
  },
  itemqtyTwoView: {
    backgroundColor: 'rgba(216, 216, 216, 0.3)',
    width: 35,
    height: 35,
    justifyContent: 'center',
  },
  textThreeText: {
    backgroundColor: 'transparent',
    color: 'rgb(171, 171, 171)',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginLeft: 13,
    marginRight: 14,
  },
  itempriceTwoView: {
    backgroundColor: 'rgba(216, 216, 216, 0.4)',
    width: 66,
    height: 35,
    justifyContent: 'center',
  },
  textFourText: {
    backgroundColor: 'transparent',
    color: 'rgb(171, 171, 171)',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    marginLeft: 11,
    marginRight: 11,
  },
  itemassignbtnTwoImage: {
    resizeMode: 'center',
    backgroundColor: 'transparent',
    width: 33,
    height: 35,
  },
  currtotalinfoView: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    width: 336,
    height: 65,
    marginLeft: 34,
    marginTop: 50,
  },
  totalText: {
    backgroundColor: 'transparent',
    color: 'rgb(221, 185, 11)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  totalfieldView: {
    backgroundColor: 'rgb(255, 244, 201)',
    width: 92,
    height: 36,
    justifyContent: 'center',
  },
  textFiveText: {
    color: 'rgb(221, 185, 11)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: 'transparent',
    marginLeft: 11,
    marginRight: 11,
  },
  evensplitbtnButtonText: {
    color: 'rgb(221, 185, 11)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  evensplitbtnButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  evensplitbtnButton: {
    backgroundColor: 'rgb(255, 244, 201)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgb(253, 216, 63)',
    borderStyle: 'solid',
    shadowColor: 'rgb(214, 214, 214)',
    shadowRadius: 6,
    shadowOpacity: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    width: 232,
    height: 36,
  },
  dinerList: {
    flex: 1,
    marginRight: 50,
    marginTop: 25,
    height: "auto",
  },
  dinerrowView: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    width: 322,
    height: 90,
    marginLeft: 39,
    marginTop: 31,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dinercompView: {
    backgroundColor: 'rgb(242, 235, 241)',
    borderRadius: 14,
    width: 150,
    height: 90,
    margin: 1,
  },
  youText: {
    backgroundColor: 'transparent',
    color: 'rgb(255, 65, 32)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    position: 'absolute',
    left: 20,
    right: 20,
    top: 21,
  },
  textSixText: {
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
  resetreceiptbtnButton: {
    backgroundColor: 'rgb(255, 235, 231)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgb(255, 65, 32)',
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
    marginRight: 102,
    marginBottom: 9,
  },
  resetreceiptbtnButtonImage: {
    resizeMode: 'contain',
    marginRight: 10,
  },
  resetreceiptbtnButtonText: {
    color: 'rgb(255, 65, 32)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  tipconfirmbtnButton: {
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
    marginRight: 102,
    marginBottom: 11,
  },
  tipconfirmbtnButtonText: {
    color: 'rgb(150, 177, 151)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  tipconfirmbtnButtonImage: {
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
  modalTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  modalBtn: {
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
    marginRight: 50,
    marginLeft: 80,
    marginTop: 25,
  },
  modalBtnTxt: {
    color: 'rgb(150, 177, 151)',
    fontSize: 21,
    fontStyle: 'normal',
    fontWeight: 'normal',
    textAlign: 'center',
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
)(ConfigRec03);
