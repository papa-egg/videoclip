
import { videoPlay, player, clipFragments, deleteFragments, historyArr }  from './videoclip-init'
import { appendElement, beforeElement, toRealTime, vjsHistoryPart, saveHistory } from './common'

import Timeline from './timeline/timeline'
import PreviewBar from './preview-video/preview-video'

const eControlBar = document.querySelector('.vjs-control-bar');
const eCurrentTime = document.querySelector('.vjs-current-time');

beforeElement(eControlBar, `
    <div class="vjs-editor-progress" id="J_vjs-editor-progress">
        <div class="vjs-editor-timeplay" id="J_vjs-editor-timeplay">00:00</div>
        <div class="vjs-editor-moveicon" id="J_vjs-editor-moveicon"></div>
        <div class="vjs-progress-line" id="J_vjs-progress-line"><div class="vjs-progress-icon" id="J_vjs-progress-icon"><i></i></div></div>
    </div>
`);

beforeElement(eCurrentTime, `
    <div class="vjs-editor-curtime"><span id="J_vjs-editor-curtime">00:00</span>/<span id="J_vjs-editor-alltime">13:05</span></div>
`);


const T = new Timeline();
const P = new PreviewBar();

document.getElementById('J_save').addEventListener('click', () => {
    console.log(clipFragments);
});

document.getElementById('J_revoked').addEventListener('click', () => {
    if (historyArr.length <= 1) {
        alert('已经是最后一步了！');

        return;
    }

    var obj = vjsHistoryPart.getPart();

    clipFragments.length = 0;
    deleteFragments.length = 0;

    Object.assign(clipFragments, obj.cg);
    Object.assign(deleteFragments, obj.dg);

    clipFragments.splice(0, 0);
    deleteFragments.splice(0, 0);

    vjsHistoryPart.removePart();

    saveHistory();
});

document.getElementById('J_reload').addEventListener('click', () => {
    if (historyArr.length <= 1) {
        alert('已经是原始视频了！');

        return;
    }
    var obj = vjsHistoryPart.getFirstPart();

    clipFragments.length = 0;
    deleteFragments.length = 0;

    Object.assign(clipFragments, obj.cg);
    Object.assign(deleteFragments, obj.dg);

    clipFragments.splice(0, 0);
    deleteFragments.splice(0, 0);

    historyArr.length = 0;
    historyArr.push(obj);

    saveHistory();
});

videoPlay.on('timeupdate', function () {
    let curTime = videoPlay.currentTime();

    if ((parseInt(curTime) - 1) > (clipFragments[clipFragments.length - 1].et + clipFragments[clipFragments.length - 1].over)) {
        videoPlay.pause();

        videoPlay.currentTime(clipFragments[0].st + clipFragments[0].over);

        T.setLocalTime(0);
        P.setProgressBar(0);

        return;
    }
    if (acrossDeletePart(curTime)) return;

    const shallowTime = toShallowTime(curTime);

    T.setLocalTime(shallowTime);
    P.setProgressBar(shallowTime);
});

function acrossDeletePart(ct) {
    var _index = isInDeletepart(ct);

    if (_index > -1) {
        videoPlay.currentTime(deleteFragments[_index].et + 1);

        return true;
    }

    return false;
}

function toShallowTime(ct) {
    var _index = getIndex(ct);

    return ct - clipFragments[_index].over;
}

function getIndex (curTime) {
    let _index = 0;

    for (let i = 0, l = clipFragments.length; i < l; i++) {
        if (curTime < clipFragments[i].et + clipFragments[i].over) {
            _index = i;
            break;
        }
    }

    return _index;
}

function isInDeletepart(curTime) {
    let _index = -1;

    for (let i = 0; i < deleteFragments.length; i++) {
        if (curTime >= deleteFragments[i].st && curTime <= deleteFragments[i].et) {
            _index = i;
            break;
        }
    }

    return _index;
}

