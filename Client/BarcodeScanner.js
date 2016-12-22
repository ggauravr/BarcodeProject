import React from 'react';
import {
  StyleSheet,
  Vibration,
} from 'react-native';
import Camera from 'react-native-camera';
import Popup from 'react-native-popup';
import config from './config';

export default class BarcodeScanner extends React.Component {
  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.cameraRoll,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
      productName: '',
      barcode: '',
      type: '',
      text: '',
    };

    this.handleBarcode = this.handleBarcode.bind(this);
  }

  findProduct(barcode) {
      return fetch(`${config.SERVER}/barcodes/find/${barcode}`)
                .then(response => response.json())
  }

  resetState() {
      this.setState({
        barcode: '',
        productName: '',
        type: '',
        text: '',
      });
  }

  handleBarcode(e) {
      if (e.data !== this.state.barcode || e.type !== this.state.type) {
        Vibration.vibrate();

        this.setState({
            barcode: e.data,
            type: e.type
        });

        this.findProduct(e.data)
            .then(product => {
                if (product.product_name) {
                    let productName = product.product_name;
                    // product found
                    this.setState({
                      barcode: product.upc,
                      productName,
                      text: `${productName}`,
                      type: e.type,
                    });

                    this.popup.tip({
                        title: 'Product found!',
                        content: `${productName}`,
                        btn: {
                            text: 'OK!',
                            style: {
                                color: 'green'
                            },
                            callback: () => {
                                this.resetState();
                            }
                        }
                    });
                }
                else {
                    this.popup.tip({
                        title: 'Product not found!',
                        content: 'Please try again',
                        btn: {
                            text: 'Close!',
                            style: {
                                color: 'red'
                            },
                            callback: () => {
                                this.resetState();
                            }
                        }
                    });
                }
            })
            .catch(() => {
                this.popup.tip({
                    title: 'Product not found!',
                    content: 'Please try again',
                    btn: {
                        text: 'Go back',
                        style: {
                            color: 'red'
                        },
                        callback: () => {
                            this.resetState();
                        }
                    }
                });
            })
        }
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          type={this.state.camera.type}
          flashMode={this.state.camera.flashMode}
          defaultTouchToFocus
          mirrorImage={false}
          onBarCodeRead={this.handleBarcode}>

          <View style={styles.rectangleContainer}>
              <View style={styles.rectangle}/>
          </View>
        </Camera>

        <Popup ref={popup => this.popup = popup } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rectangleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 1,
    borderColor: '#00FF00',
    backgroundColor: 'transparent',
  },
  popupContainer: {
      zIndex: 100,
  },
  overlay: {
      opacity: 0.8,
      zIndex: 50,
  },
  tipBoxView: {
      zIndex: 75,
  }
});
