import React, {Component} from 'react';
import './figure.css'

class ImgFigure extends Component {
    render() {

        var imgFigureClassName = 'img-figure';

        return(
            <figure className={imgFigureClassName}>
                <img src={this.props.data.imageURL}
                     alt={this.props.data.title}
                />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back">
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        )
    }

}

export default ImgFigure;
