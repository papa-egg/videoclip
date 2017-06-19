
import { toPreTime, toSedTime, toInt, toRealTime, vjsHistoryPart, saveHistory } from '../common'
import { videoPlay, player, clipFragments, deleteFragments }  from '../videoclip-init'

class Timeline {

    constructor () {
        this.playBox = document.getElementById('J_editor-handler-box');
        this.playLine = document.getElementById('J_editor-playline');
        this.playLineBar = document.getElementById('J_editor-playline-line');
        this.playLineTime = document.getElementById('J_editor-playline-time');
        this.clipBox = document.getElementById('J_editor-playline-clip');
        this.playUlist = document.getElementById('J_editor-timeline');
        this.playCurTime = document.getElementById('J_vjs-editor-curtime');
        this.playAllTime = document.getElementById('J_vjs-editor-alltime');

        this.moveFlag = false;
        this._singleWidth = this.playBox.querySelector('li').offsetWidth;

        this._init();
    }

    setLocalTime(lt) {
        lt = toInt(lt);

        var self = this;

        this.playCurTime.innerHTML = toPreTime(lt);

        getMoveLeft(lt);

        function getMoveLeft(time) {
            self._updatePlayTime(time);

            var eq = 0;

            for (let i = 0; i < clipFragments.length; i++) {
                if (clipFragments[i].et > time) {
                    eq = i;
                    break;
                }
            }

            var otherWidth = 0;
            if (eq > 0) {
                otherWidth = self._singleWidth * eq;
                time = time - clipFragments[eq].st;
            }

            const maxWidth = self.playBox.querySelector('.editor-timeline').offsetWidth;

            let moveLeft = (parseFloat((time / clipFragments[eq].spt) * self._singleWidth) + otherWidth);

            if (moveLeft < 0 ) {
                moveLeft = 0;
            } else if (moveLeft > maxWidth) {
                moveLeft = maxWidth;
            }

            self._playMoveLeft(moveLeft);
        }
    }

    _init () {
        this._bindEvent();
    }
    _updatePlayTime (sT) {
        this.playLineTime.innerHTML = toPreTime(sT);
    }
    _bindEvent () {
        this.clipBox.addEventListener('click', this._clipHandler.bind(this));
        this.playBox.addEventListener('mousemove', this._moveEventHandler.bind(this));
        this.playLineBar.addEventListener('mousedown', () => { this.moveFlag = true; videoPlay.pause() } );
        document.querySelector('#J_editor-timeline').addEventListener('click', (e) => {
            if (e.target.className == 'editor-detele-btn') {
                const index = e.target.dataset.index;

                deleteFragments.push({
                    st: clipFragments[index].st + clipFragments[index].over,
                    et: clipFragments[index].et + clipFragments[index].over,
                });

                deleteFragments.sort((a, b) => {
                    return a.st - b.st;
                });

                clipFragments.forEach((item, _index) => {
                    if (_index > index) {
                        item.over += clipFragments[index].spt;
                        item.st -= clipFragments[index].spt;
                        item.et -= clipFragments[index].spt;
                    }
                });

                clipFragments.splice(index, 1);
                this.playAllTime.innerHTML = toPreTime(clipFragments[clipFragments.length - 1].et);

                vjsHistoryPart.addPart();

                saveHistory();
            }
        }, true);

        document.addEventListener('mouseup', () => {
            if (this.moveFlag) {
                this.moveFlag = false;

                videoPlay.currentTime(toRealTime(this._getTimelineTime()));
                videoPlay.play();
            }

        });
    }
    _getTimelineTime () {
        return toSedTime(this.playLineTime.innerHTML);
    }
    _moveEventHandler (e) {
        if ((!this.moveFlag)) return;

        const maxWidth = this.playBox.querySelector('.editor-timeline').offsetWidth;
        let moveLeft = e.pageX - getAbsLeft(this.playBox);

        if (moveLeft < 0 ) {
            moveLeft = 0;
        } else if (moveLeft > maxWidth) {
            moveLeft = maxWidth;
        }

        this._playMoveLeft(moveLeft);
        this._playMoveTime(moveLeft);
    }
    _playMoveLeft (l) {
        this.playLine.style.left = l + 'px';
    }
    _playMoveTime (l) {
        const scale = l / this._singleWidth;
        const truncScale = Math.trunc(scale);
        let eq = truncScale;

        if (scale == truncScale) {
            eq = scale - 1 < 0 ? 0 : scale - 1;
        }

        const datas = this.playUlist.querySelectorAll('li')[eq].dataset;
        const curSt = toInt(datas.st);
        const curSpt = toInt(datas.spt);

        this._updatePlayTime(toInt((l - this._singleWidth * eq) / this._singleWidth * curSpt) + curSt)
    }
    _clipHandler () {
        if (clipFragments.length >= 6) {
            alert('已经放不下了！');

            return;
        }

        const curClipTime = this._getTimelineTime();

        if (curClipTime == 0) return;

        let curIndex = 0;

        for (let i = 0; i < clipFragments.length; i++) {
            if (clipFragments[i].et > curClipTime) {
                curIndex = i;
                break;
            }
            if (clipFragments[i].et == curClipTime) return;
        }

        const curClipFg = clipFragments.slice(curIndex, curIndex + 1)[0];

        var _timer = setInterval(() => {
            if (videoPlay.readyState() == 4) {

                const _img = this._getScreenImgSrc();

                clipFragments.splice(curIndex, 1, {
                    st: curClipFg.st,
                    et: curClipTime,
                    spt: curClipTime - curClipFg.st,
                    over: curClipFg.over,
                    img: curClipFg.img,
                }, {
                    st: curClipTime,
                    et: curClipFg.et,
                    spt: curClipFg.et - curClipTime,
                    over: curClipFg.over,
                    img: _img,
                });

                clearInterval(_timer);

                vjsHistoryPart.addPart();

                saveHistory();
            }
        }, 100);

    }
    _getScreenImgSrc () {
        var canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 576;
        canvas.getContext('2d').drawImage(document.getElementById('J_preview-video_html5_api'), 0, 0, canvas.width, canvas.height);
        var img = document.createElement("img");
        img.src = canvas.toDataURL();

        return img.src;
    }
}

function getAbsLeft(obj) {
    let l = obj.offsetLeft;

    while (obj.offsetParent != null) {
        obj = obj.offsetParent;
        l += obj.offsetLeft;
    }

    return l;
}

export default Timeline;