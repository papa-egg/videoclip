
import { toPreTime, toSedTime, toInt, getAbsLeft, toRealTime } from '../common'
import { videoPlay, player, clipFragments }  from '../videoclip-init'

class PreviewBar {
    constructor () {

        this.progress = document.getElementById('J_vjs-editor-progress');
        this.presentBar = document.getElementById('J_vjs-progress-line');
        this.moveIcon = document.getElementById('J_vjs-editor-moveicon');
        this.timePlay = document.getElementById('J_vjs-editor-timeplay');
        this.dragIcon = document.getElementById('J_vjs-progress-icon');

        this.dragFlag = false;

        this._init();
    }

    setProgressBar (time) {
        this._setPresent(time / clipFragments[clipFragments.length - 1].et);
    }
    _init () {
        this._bindEvent();
    }
    _bindEvent () {
        this.progress.addEventListener('mousemove', this._pressentBarMove.bind(this));
        this.dragIcon.addEventListener('mousedown', () => { this.dragFlag = true; videoPlay.pause() } );
        document.addEventListener('mouseup', () => { if (this.dragFlag){ this.dragFlag = false; videoPlay.play(); }  });
        this.progress.addEventListener('click', this._locatePreTime.bind(this));
    }
    _locatePreTime () {
        videoPlay.currentTime(toRealTime(this._getPresentTime()));
    }
    _pressentBarMove (e) {
        const proMoveLeft = e.pageX - getAbsLeft(this.progress);

        this.moveIcon.style.left = proMoveLeft + 'px';

        this._setPresentTime(toInt((proMoveLeft / 500) * clipFragments[clipFragments.length - 1].et));

        let timePlayMove = proMoveLeft;

        if (timePlayMove < 18) {
            timePlayMove = 18;
        } else if (timePlayMove > (500 - 18)) {
            timePlayMove = 500 - 18;
        }

        this.timePlay.style.left = timePlayMove + 'px';

        if (this.dragFlag) {
            this._setPresent(timePlayMove / 500);
        }
    }
    _setPresent (present) {
        this.presentBar.style.width = `${ present * 100 }%`;
    }
    _setPresentTime (time) {
        this.timePlay.innerHTML = toPreTime(time);
    }
    _getPresentTime () {
        return toSedTime(this.timePlay.innerHTML);
    }
}

export default PreviewBar