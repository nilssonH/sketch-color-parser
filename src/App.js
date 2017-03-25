import React, {Component} from 'react'
import sketch2json from 'sketch2json'

import convertToHex from './utils/convertToHex'

var hexValue = []
var colorsUsed = []

class App extends Component {
    constructor() {
        super()

        this.handleFileRead = this.handleFileRead.bind(this);
        this.handleDrop = this.handleDrop.bind(this);

        this.state = {
            dragging: false,
            fileDropped: null,
            fileName: '',
            colors: []
        }
    }

    handleFileRead = (component, reader, name) => () =>
        sketch2json(reader.result).then(data => {
            for(var page in data.pages) {
                if(data.pages.hasOwnProperty(page)) {
                    var current = data.pages[page];
                    iterate(current, '')
                }
            }

            component.setState({colors: colorsUsed})
        })

    handleDrop = (component) => (e) => {
        e.preventDefault()
        e.stopPropagation()

        component.setState({
            dragging: false,
            fileDropped: true,
            colors: []
        })

        // Reset the colors when uploading a new file
        colorsUsed = []

        const {files} = e.dataTransfer

        for (let i = 0; i < files.length; i++) {
            const {name} = files[i]
            const reader = new window.FileReader()
            reader.onload = this.handleFileRead(
                component,
                reader,
                name
            )

            reader.readAsArrayBuffer(files[i])

            component.setState({
                fileName: files[i].name
            })

            console.log(files[i]);
        }
    }

    render() {
        return (
            <main className="sans-serif flex flex-column">
                <section className="w-100 mw8 pa5 pt6 pb6 center">
                    <div className="pa4 bw1 br2 b--dashed b--silver tc"
                        onDragEnter={(e) => {
                            e.preventDefault()
                            this.setState({ dragging: true })
                        }}

                        onDragLeave={(e) => {
                            e.preventDefault()
                            this.setState({ dragging: false })
                        }}

                        onDragOver={(e) => {
                            e.preventDefault()
                            return false
                        }}

                        onDrop={this.handleDrop}

                        style={{
                            backgroundColor: this.state.dragging ? 'rgba(0,0,0,.08)' : 'white',
                            transition: 'all 0.25s ease-in-out',
                            color: '#999',
                            display: 'block'
                        }}>

                        Drag a Sketch v43 file to extract.
                    </div>

                    {this.state.fileDropped === null ? true :
                        <div className="fileDetails mt4">
                            <h3 className="mb3 mt0 lh-title">Uploaded file:</h3>
                            <p className="ml0 gray">{this.state.fileName}</p>
                        </div>
                    }

                </section>

                <section
                    style={{
                        backgroundColor: 'white',
                        color: 'black',
                        display: 'block',
                        width: '100%'
                    }}>

                    <div className="pa5 pt0 pb6 flex flex-column mw8 center">
                        <h3 className="f6 ttu fw6 mt0 mb3 bb pb2">Colors</h3>
                        <div className="col">

                            {this.state.fileDropped === true ? null :
                                <p>There are no colors yet. 😔</p>
                            }

                            {this.state.colors.map(function(color, i){
                                return (
                                    <div className="bb b--black-05 color flex sans-serif" key={i}>
                                        {color === "#ffffff" ?
                                            <div className="pa4 shadow" style={{backgroundColor: color}}></div>:
                                            <div className="pa4" style={{backgroundColor: color}}></div>
                                        }

                                        <p className="ph4 f4 b" style={{color: color}}>Aa</p>
                                        <p className="ph4 f6 black-60 self-center">{color}</p>
                                  </div>
                                );
                            }, this)}
                        </div>
                    </div>
                </section>
            </main>
        )
    }
}

function iterate(obj, stack) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            if (typeof obj[property] === "object") {
                iterate(obj[property], stack + '.' + property);
            } else if (property === "_class" && obj[property] === "color") {
                hexValue = [];
                var red = obj.red;
                var green = obj.green;
                var blue = obj.blue;
                var alpha = obj.alpha;

                // Do the thing
                var color = convertToHex.rgbToHex(hexValue, red, green, blue, alpha)

                if (colorsUsed.indexOf(color) < 0) {
                    colorsUsed.push(color)
                    console.log(colorsUsed)
                }
            }
        }
    }
}

export default App
