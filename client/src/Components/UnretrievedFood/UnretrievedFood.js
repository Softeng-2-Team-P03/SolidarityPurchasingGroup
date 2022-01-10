import 'bootstrap/dist/css/bootstrap.min.css';
import './UnretrievedFood.css';
import { Line, Radar, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import React, {useEffect, useState} from "react";
import {Button, Card, Form, Table} from "react-bootstrap";
import API from "../../api/booking-api";
import api from "../../API";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    type: 'line',
    options: {
        plugins: {
            title: {
                text: 'Chart.js Time Scale',
                display: true
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    // Luxon format string
                    tooltipFormat: 'DD T'
                },
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'value'
                }
            }
        },
    },
};



function UnretrievedFood() {

    //flag Week/Month
    const [flagWM,setFlagWM] = useState(0);
    const [weekFood,setWeekFood] = useState([]);
    const [monthFood,setMonthFood] = useState([]);
    const [yearFood,setYearFood] = useState([]);
    const [unrProdId,setUnrProdId] = useState([]);
    const [unrProdType,setUnrProdType] = useState([]);
    const [pickupOrders,setPickupOrders] = useState([]);
    const [pickupUnretrieved,setPickupUnretrieved] = useState([]);
  //  const [sumPickO,setSumPickO] = useState([]);
    const [countProdType,setCountProdType] = useState([]);
    //const [maxProd,setMaxProd] = useState(0);
    const [countB,setCountB] = useState([]);
    const [prodsName,setProdsName] = useState([]);
    let now = new Date(localStorage.getItem('virtualDate'));
    let MonthDates = [];
    const [saturdMonth,setSaturdMonth] = useState([]);
    const [countDiffProd,setCountDiffProd] = useState(0);
    const [countQntTot,setCountQntTot] = useState(0);


    function getNextSaturday(date) {
        // Code to check that date and dayOfWeek are valid left as an exercise ;)

        var resultDate = new Date(date.getTime());

        resultDate.setDate(date.getDate() + (7 + 6 - date.getDay()) % 7);

        return resultDate;
    }

    function getMonthDays(date){
        let i;
        let index=0;
        let days=[];
        let daysTime=[];
        let nextWeekDate = new Date();
       // console.log(date);
        let month=date.getMonth()+1;
        date.setDate(1);

        date.setDate(getNextSaturday(date).getDate());

        nextWeekDate.setTime(date.getTime());

        for(i=0;i<4;i++)
        {
            if(nextWeekDate.getMonth()+1===month) {
                daysTime[index]=nextWeekDate.getFullYear() + "-" + (nextWeekDate.getMonth()+1) + "-" + nextWeekDate.getDate().toString().padStart(2, "0");
                days[index]=nextWeekDate.getDate().toString().padStart(2, "0") + " " + (nextWeekDate.getMonth()+1) + " " + nextWeekDate.getFullYear();

                index++;
            }
            nextWeekDate.setTime(nextWeekDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        }

        MonthDates=daysTime;
       // console.log(MonthDates);
        setSaturdMonth(days);
    }


    useEffect(() => {

        getMonthDays(now);
       // console.log(MonthDates);

    }, []);



    useEffect(() => {
        let mounted = true;
        let foodW;
        let foodM;
        let unProdId=[];
        let unProdType=[];
        let pickupO;
        let pickupU;
        let orders;
        let i=0;
        let counts=[];
        let cnt=[];
        let maxP;
        let countsBar=[];
        let productsName=[];
        let index=0;
        let prods;
        let qnt=0;




        const getUnretrieved = async () => {


             prods= await api.getAllProducts();
             maxP=prods.length;

             for(i=0;i<maxP;i++) {
           // for(i=0;i<10;i++) { debug only
                 unProdId[i] = await API.getUnretrievedByProductId(i + 1);
                 if(unProdId[i].length!==0) {
                     productsName[index]=prods[i].name;
                     countsBar[index]=0;
                     unProdId[i].forEach(x => {
                         countsBar[index] = countsBar[index] + x.UnretrievedQuantity
                         qnt+=x.UnretrievedQuantity;
                     });

                     index++;
                     setCountDiffProd(index);
                 }

             }

             setCountQntTot(qnt);


             for(i=0;i<6;i++) {
                 unProdType[i] = await API.getUnretrievedByProductType(i + 1);
                  //numero di diversi prodotti per categoria
                    counts[i]=unProdType[i].length;
             }

             orders = await API.getOrders();


            //per settimana
            for (i=0;i<MonthDates.length;i++) {
            foodW = await API.getUnretrievedOfWeek(MonthDates[i]);
            //console.log(foodW);
            monthFood.push(foodW.length);
            }

            //per mese
            for (i=0;i<12;i++) {
                foodM = await API.getUnretrievedOfMonth(i+1,2021);
                yearFood.push(foodM.length);
            }



        };
        getUnretrieved().then(data => {
            if (mounted) {
               /*setWeekFood(foodW);
                setMonthFood(foodM);*/
                setUnrProdId(unProdId);
                setUnrProdType(unProdType);
                pickupO=orders.filter(x => x.PickupTime!==null);
                pickupU=orders.filter(x => x.State===5);
                setPickupOrders(pickupO);
                setPickupUnretrieved(pickupU);
                setCountProdType(counts);
                setCountB(countsBar);
                setProdsName(productsName);
            }
        })
            .catch(err => {
                console.error(err);
            });
        return () => {
            mounted = false
        };


    }, []);



    const dataRadar = {
        labels: ['Fruits & Vegetables', 'Dairy', 'Meat & Salumi', 'Sea Products', 'Bakery & Sweets', 'Baverages'],
        datasets: [
            {
                label: 'Unretrieved products of the category',
                data: countProdType,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const dataLinearMonth = {
        labels:saturdMonth,
        datasets: [
            {
                label: 'Unretrieved products of Week',
                data: monthFood,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const dataLinearWeek = {
        labels:['January','February','March','April','May',
        'June','July','August','September','October','November',
        'December'],
        datasets: [
            {
                label: 'Unretrieved producs of Month',
                data: yearFood,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    const dataBar = {
        labels:prodsName,
        datasets: [
            {
                label: 'Unretrieved quantity of product',
                data: countB,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },

        ],
    };


    return (
        <div className="body">
               <div className="containerCard">
                <div className="row">

                    <div className="col-md-4 col-xl-3">
                        <div className="card bg-c-green order-card">
                            <div className="card-block">
                                <h6 className="m-b-20">Pickup Orders Received</h6>
                                <h2 className="text-right"><i className="fa fa-credit-card f-left"></i><span></span>
                                </h2>
                                <p className="m-b-0"><h2 className="f-right">{pickupOrders.length}</h2></p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-xl-3">
                        <div className="card bg-c-blue order-card">
                            <div className="card-block">
                                <h6 className="m-b-20">Orders With Unretrived Food</h6>
                                <h2 className="text-right"><i className="fa fa-cart-plus f-left"></i><span></span>
                                </h2>
                                <p className="m-b-0"><h2 className="f-right">{pickupUnretrieved.length}</h2></p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-xl-3">
                        <div className="card bg-c-yellow order-card">
                            <div className="card-block">
                                <h6 className="m-b-20">Different Unretrieved Product</h6>
                                <h2 className="text-right"><i className="fa fa-rocket f-left"></i><span></span></h2>
                                <p className="m-b-0"><h2 className="f-right">{countDiffProd}</h2></p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 col-xl-3">
                        <div className="card bg-c-pink order-card">
                            <div className="card-block">
                                <h6 className="m-b-20">Total Unretrieved Product Quantity</h6>
                                <h2 className="text-right"><i className="fa fa-refresh f-left"></i><span></span></h2>
                                <p className="m-b-0"><h2 className="f-right">{countQntTot}</h2></p>
                            </div>
                        </div>
                    </div>


                </div>
               </div>



            <Card className="cardChart2">
                <Card.Body>

                    <div className="flex-container">
                        <h5 className="cardFilterText">filter by</h5>

                        {flagWM ?
                            <Button className="buttonWM" variant="primary" onClick={() => setFlagWM(0)}>Week</Button>
                            :
                            <Button className="buttonWM" variant="danger" onClick={() => setFlagWM(1)}>Month</Button>
                        }
                    </div>

                    {flagWM ?
                        <div className="containerLinearChart">
                            <Line options={options} data={dataLinearWeek} />
                        </div>
                        :
                        <div className="containerLinearChart">
                            <Line options={options} data={dataLinearMonth} />
                        </div>
                    }

                </Card.Body>
            </Card>




            <div className="flex-container">


                <Card className="cardChart3">
                    <Card.Body>
                        <Bar options={options} data={dataBar} />
                    </Card.Body>
                </Card>


                <Card className="cardChart1">
                    <Card.Body>
                <div className="containerRadarChart">
                    <Radar data={dataRadar} />
                </div>
                    </Card.Body>
                </Card>






            </div>




        </div>
    );
};

export default UnretrievedFood;
