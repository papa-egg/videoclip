
import { toPreTime } from './common'

const videoPlay = videojs('J_preview-video');

let clipFragments;
let deleteFragments;
let historyArr;

if (localStorage.getItem('history')) {
    var his = JSON.parse(localStorage.getItem('history')).history;
}

if (false) {
    clipFragments = his[his.length - 1].cg;
    deleteFragments = his[his.length - 1].dg;
    historyArr = his;
} else {
    clipFragments = [
        {
            st: 0,
            et: 785,
            spt: 785,
            over: 0,
            img: './src/images/default.png',
        }
    ];

    deleteFragments = [];

    historyArr = [
        {
            cg: [
                {
                    st: 0,
                    et: 785,
                    spt: 785,
                    over: 0,
                    img: './src/images/default.png',
                }
            ],
            dg: [],
        }
    ];
}


let app = new Vue({
    el: '#J_editor-timeline',
    data: {
        clipFragments,
    },
    filters: {
        toPreTime
    }
});


let player = {
    get currentTime () {
        return this;
    },
    set currentTime (ct) {
        alert(ct);
    }
};

export { videoPlay, player, clipFragments, deleteFragments, historyArr };




