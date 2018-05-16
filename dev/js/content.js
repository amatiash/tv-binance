'use strict';

import './content.scss';
import qs from 'querystring';
import chartTemplate from './content.chart.handlebars';

// ----------------------------------------------------

const EXCHANGE = 'BINANCE';

// ----------------------------------------------------

class BinanceInjector {
    nodes = {
        binanceChart  : null,
        chartContainer: null,
        tvIframe      : null
    };

    state = {
        isEnabled: true,
        page     : null,
        symbol   : null,
        isMounted: null,
    };

    oldHref = document.location.href;

    // ----------------------------------------------------

    constructor(){
        this.render();
        chrome.runtime.onMessage.addListener(this.onMessage);
        setInterval(this.listedUrlChange, 500);
    }

    listedUrlChange = () =>{
        let newHref = document.location.href;

        if(this.oldHref !== newHref){
            this.oldHref = newHref;
            this.render();
        }
    };

    onMessage = (message) =>{
        if(message.event === 'toggleEnabled'){
            this.state.isEnabled ? localStorage.setItem('tv_disabled', 'true') : localStorage.removeItem('tv_disabled');
            this.render();

            chrome.runtime.sendMessage({
                event: 'changeIcon',
                data : {enable: this.state.isEnabled}
            });
        }
    };

    updateState(){
        let query       = qs.parse(location.search.substr(1)),
            querySymbol = ('symbol' in query) ? query.symbol.replace('_', '') : (localStorage.getItem('ProStatus'));

        // ----------------------------------------------------

        if(location.pathname.includes('tradeDetail.html'))
            this.state.page = 'tradeDetail';
        else if(location.pathname.includes('trade.html'))
            this.state.page = 'trade';
        else
            this.state.page = null;

        // ----------------------------------------------------

        this.state.isEnabled = !localStorage.getItem('tv_disabled');
        this.state.symbol    = `${EXCHANGE}:${querySymbol || 'BNBBTC'}`;
    }

    getTvIframeSrc(){
        let isPro       = this.state.page === 'tradeDetail',
            theme       = isPro ? 'Dark' : 'Light',
            bg          = isPro ? 'rgba(39, 45, 51, 1);' : 'rgba(255, 255, 255, 1)',
            encodedData = encodeURIComponent(chartTemplate({
                symbol: this.state.symbol,
                width : Math.round(screen.availWidth / 100 * 80),
                height: screen.availHeight,
                bottom: isPro,
                theme,
                bg,
            }));

        return 'data:text/html;charset=utf-8,' + encodedData;
    }

    render(){
        this.updateState();

        let {isEnabled, isMounted, page, symbol} = this.state,
            shouldMount                          = isEnabled && !!page,
            shouldUnmound                        = isMounted;

        let binanceChart   = document.getElementById('kline-con') || document.getElementById('klinecon'),
            chartContainer = binanceChart ? binanceChart.parentElement : null;

        if(shouldUnmound){
            this.nodes.tvIframe.remove();
            this.state.isMounted = false;
        }

        if(shouldUnmound && !shouldMount)
            binanceChart && binanceChart.classList.remove('klinecon--hidden');

        if(shouldMount){
            if(!binanceChart || !chartContainer)
                throw new Error(`TradingView chart injecting failed, because couldn't find and hide BinanceChart :(`);

            binanceChart.classList.add('klinecon--hidden');

            this.nodes.tvIframe     = document.createElement('iframe');
            this.nodes.tvIframe.src = this.getTvIframeSrc();
            this.nodes.tvIframe.id  = 'tv-iframe';

            chartContainer.appendChild(this.nodes.tvIframe);

            this.state.isMounted = true;
        }
    }
}

// ----------------------------------------------------

new BinanceInjector();