import React, { useEffect, useRef, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:5000";

const WebSock = () => {
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [time, setTime] = useState([]);

  const prepareData = (array) => {
    return array.map((item) => {
      var asks = JSON.parse(item.asks);

      var ask_sum = 0;
      for (const prop in asks) {
        ask_sum += asks[prop];
      }
      var bids = JSON.parse(item.bids);

      var bid_sum = 0;
      for (const prop in bids) {
        bid_sum += bids[prop];
      }

      return {
        time: item.time,
        ask: ask_sum,
        bid: bid_sum,
      };
    });
  };

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on("FromAPI", (res) => {
      var newData = prepareData(res);

      var asks = newData.map((item) => item.ask);
      console.log("asks", asks);
      var times = newData.map((item) => item.time);
      var bids = newData.map((item) => item.bid);

      setAsks((prev) => [asks, ...prev]);
      setBids((prev) => [bids, ...prev]);
      setTime((prev) => [times, ...prev]);
    });
  }, []);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          xAxis: {
            tickInterval: 1,
          },
          yAxis: {
            minorTickInterval: 0.1,
          },
          title: {
            text: "My chart",
          },
          series: [
            {
              name: "asks",
              data: asks,
            },
            // {
            //   name: "bids",
            //   data: bids,
            // },
          ],
        }}
      />
    </div>
  );
};

export default WebSock;
