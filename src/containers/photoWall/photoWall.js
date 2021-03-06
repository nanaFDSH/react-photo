import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import ImgFigure from '../../components/imgFigure/imgFigure';
// import ControllerUnit from '../../components/controllerUnit/controllerUnit';

import './wall.css';

// 获取图片相关的数据
var imageDatas = require('../../data/imgData.json');

// 利用自执行函数， 将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];

        singleImageData.imageURL = require('../../common/images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }

    return imageDatasArr;
})(imageDatas);

/*
 * 获取区间内的一个随机值
 */
function getRangeRandom(low, high) {
    console.log(low)
    return Math.ceil(Math.random() * (high - low) + low);
}

/*
 * 获取 0~30° 之间的一个任意正负值
 */
function get30DegRandom() {
    console.log('角度')
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}


class PhotoWall extends Component {

    /*
   * 翻转图片
   * @param index 传入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @returns {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
   */
    inverse(index) {
        console.log(index)
        return function () {
            var imgsArrangeArr = this.state.imgsArrangeArr;

            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

            this.setState({
                imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
    }

    /*
   * 重新布局所有图片
   * @param centerIndex 指定居中排布哪个图片
   */
    rearrange(centerIndex) {
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.state.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeLeftSecX = hPosRange.leftSecX,
            hPosRangeRightSecX = hPosRange.rightSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            topImgNum = Math.floor(Math.random() * 2),    // 取一个或者不取
            topImgSpliceIndex = 0,

            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        // 首先居中 centerIndex 的图片, 居中的 centerIndex 的图片不需要旋转
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };

        // 取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        // 布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };
        });

        // 布局左右两侧的图片
        for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            var hPosRangeLORX = null;

            // 前半部分布局左边， 右半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            } else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter: false
            };

        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }

    /*
     * 利用arrange函数， 居中对应index的图片
     * @param index, 需要被居中的图片对应的图片信息数组的index值
     * @returns {Function}
     */
    center(index) {
        return function () {
            this.rearrange(index);
        }.bind(this);
    }

    // 初始
    constructor(){
        super()
        this.state={
            imgsArrangeArr:[],
            Constant: {  // 存储屏幕 水平 垂直 范围
                centerPos: {
                    left: 0,
                    right: 0
                },
                hPosRange: {   // 水平方向的取值范围
                    leftSecX: [0, 0],
                    rightSecX: [0, 0],
                    y: [0, 0]
                },
                vPosRange: {    // 垂直方向的取值范围
                    x: [0, 0],
                    topY: [0, 0]
                }
            }
        }
    }

    // 组件加载以后， 为每张图片计算其位置的范围
    componentDidMount() {
        // 首先拿到舞台的大小
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW / 2),
            halfStageH = Math.ceil(stageH / 2);
        console.log(stageDOM.scrollWidth)

        // 拿到一个imageFigure的大小
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW / 2),
            halfImgH = Math.ceil(imgH / 2);
        console.log(imgFigureDOM.scrollWidth)

        // 计算中心图片的位置点
        this.state.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };

        console.log(this.state.Constant.centerPos)

        // 计算左侧，右侧区域图片排布位置的取值范围
        this.state.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.state.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.state.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.state.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.state.Constant.hPosRange.y[0] = -halfImgH;
        this.state.Constant.hPosRange.y[1] = stageH - halfImgH;

        // 计算上侧区域图片排布位置的取值范围
        this.state.Constant.vPosRange.topY[0] = -halfImgH;
        this.state.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.state.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.state.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);

    }

    render() {

        var controllerUnits = [],
            imgFigures = [];

        imageDatas.forEach(function (value, index) {

            if (!this.state.imgsArrangeArr[index]) {
                this.state.imgsArrangeArr[index] = {
                    pos: {
                        left: 0,
                        top: 0
                    }
                };
            }

            imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index}
                                       arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)}
                                       center={this.center(index)}/>);

            // controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

        }.bind(this));

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>
        );
    }
}

export default PhotoWall;