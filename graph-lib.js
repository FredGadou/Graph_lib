

// test 

/*

let graph = new Graph('graph_test',900,600,'linechart');
graph.setting.axis_value.y_val_step = 50;
graph.setting.title.presence = true;
graph.setting.title.content = 'Graph Test'; 
graph.draw([[0,15],[1,10],[2,12],[3,14],[4,20],[5,35],[6,49],[7,70],[8,112],[9,200],[10,400]]);

graph.draw([[0,1.5],[1,1],[2,1.2],[3,1.4],[4,2.0],[5,3.5],[6,4.9],[7,7.0],[8,8],[9,9]]);

*/




class Graph {

    constructor(canvasId, width, height, type) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.type = type;
        this.margin = {
            top:10,
            down:20,
            left:30,
            right:10
        }
        this.setting = {
            backgroundColor : 'lightgray',
            backgroundLineColor : 'darkgray',
            graphLineColor : 'darkblue',
            graphLineWidth : 4,
            lineLabelSize : 8,
            lineLabelFont : 'sans-serif',
            dots : {
                presence : true,
                size : 4,
            },
            axis_value : {
                x_val_presence : true,
                x_val_rotate : false,
                y_val_presence : true,
                y_val_step : 10,
                font : 'sans-serif',
                size : 8
            },
            title : {
                presence: false,
                font: 'sans-serif',
                size: 20,
                content: ''
            }
        }
        this.width= width;
        this.height = height;
    }



    draw(data) {  // data[[x,y],[x,y]...]

        //sort x axis
        data.sort(
            function (a, b) {
                if (a[0] === b[0]) {
                    return 0;
                } else {
                    return (a[0] < b[0]) ? -1 : 1;
                }
            }
        );


        // fixing blurry pixels
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        this.canvas.width = Math.floor(this.width * window.devicePixelRatio);
        this.canvas.height = Math.floor(this.height * window.devicePixelRatio);

        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        //


        //finding max data to set axis grid
        let max_y = 0;
        let ratio_y = 0;
        let y_line_count;

        for(let i = 0; i < data.length; i++) {  
            if(data[i][1] > max_y) max_y = data[i][1];            
        }


        // max_y must be divisible by this.setting.axis_value.y_val_step if over 20
        if(max_y > 20) {

            //give 1% space top
            max_y = Math.round(max_y * 1.1);
            while(max_y % this.setting.axis_value.y_val_step != 0) {
                max_y++;
            }
            y_line_count = max_y/this.setting.axis_value.y_val_step;

        } else {
            max_y++;
            y_line_count = max_y;
        }

        

        //ratio for scaling data to grid
        ratio_y = (this.height - (this.margin.top + this.margin.down)) / max_y;


        //setting the background graph style
        this.canvas.style.backgroundColor = this.setting.backgroundColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.setting.backgroundLineColor;






        
        /******************  Drawing starts here  ******************/

        //Title
        if(this.setting.title.presence) {
            this.ctx.font = `${this.setting.title.size}px ${this.setting.title.font}`;
            this.ctx.fillText(`${this.setting.title.content}`, (this.width/2) - (this.margin.left+this.margin.right + (this.setting.title.content.length*(this.setting.title.size/5))), this.margin.top + (this.margin.top * 1.5));
            this.margin.top = 30;
        }

        

        // draw background line
        //horizontal line
        let y_step_back_line = (this.height - (this.margin.top + this.margin.down)) / y_line_count;
        let y_line_pos = this.height - this.margin.down;
        let x_start = this.margin.left;
        let x_end = this.width - this.margin.right;
        let y_text_line = 0
        for(let i = 0; i < y_line_count; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x_start,y_line_pos);
            this.ctx.lineTo(x_end,y_line_pos);
            this.ctx.stroke();
            if(this.setting.axis_value.y_val_presence) {
                this.ctx.font = `${this.setting.axis_value.size}px ${this.setting.axis_value.font}`; 
                this.ctx.fillText(y_text_line, x_start - 20 , y_line_pos); //line data
            }
            y_text_line += max_y / y_line_count;
            y_line_pos -= y_step_back_line;
        }
        //Vertical line
        this.ctx.beginPath();
        this.ctx.moveTo(this.margin.left,this.margin.top);
        this.ctx.lineTo(this.margin.left, this.height - this.margin.down);
        this.ctx.stroke();

        
        switch (this.type) {

            case 'linechart':

                let x_step = (this.width - (this.margin.left+this.margin.right)) / (data.length);
                let x_pos = this.margin.left;
                let y_pos;
                
                this.ctx.beginPath();
                this.ctx.lineWidth = this.setting.graphLineWidth;
                this.ctx.strokeStyle = this.setting.graphLineColor;

                for(let i = 0; i < data.length; i++) {
                    y_pos = ((this.height - (this.margin.top + this.margin.down))-(data[i][1] * ratio_y)) + this.margin.top;
                    
                    
                    //Writting x axis grid range
                    if(this.setting.axis_value.x_val_presence) {
                        this.ctx.font = `${this.setting.axis_value.size}px ${this.setting.axis_value.font}`; 
                        if(i%2 === 0) {
                            if(this.setting.axis_value.x_val_rotate) {
                                this.ctx.translate(x_pos - 10, this.height - (this.margin.down - 15));
                                this.ctx.rotate(Math.PI/-5);
                                this.ctx.fillText(data[i][0], 0, 0);
                                this.ctx.rotate(Math.PI/5)
                                this.ctx.translate(-(x_pos - 10),-(this.height - (this.margin.down + 5)));
                            } else {
                                this.ctx.fillText(data[i][0], x_pos, this.height - (this.margin.down - 15));
                            }
                        }
                    }

                    if(i === 0) {
                        
                        this.ctx.moveTo(x_pos, y_pos);

                    } else if (i > 0 ) {

                        this.ctx.lineTo(x_pos, y_pos);

                    }
                    x_pos += x_step;
                }
                this.ctx.stroke()

                // drawing dots
                if(this.setting.dots.presence) {
                    x_step = (this.width - (this.margin.left + this.margin.right)) / (data.length);
                    x_pos = this.margin.left;
                    for(let i = 0; i < data.length; i++) {
                        y_pos = ((this.height - (this.margin.top + this.margin.down))-(data[i][1] * ratio_y)) + this.margin.top;
                        this.ctx.beginPath();
                        this.ctx.arc(x_pos, y_pos, this.setting.dots.size/2, 0, 2 * Math.PI);
                        this.ctx.stroke();
                        this.ctx.fill();
                        x_pos += x_step;
                    }
                }

                break;
            
            case 'column':
                break;

        }

    }

}



