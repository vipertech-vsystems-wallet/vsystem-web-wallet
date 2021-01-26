import { Howl, Howler } from "howler";

function play_sound(category, name, volume_optional) {

    const volume = volume_optional || 1;

    const src =  "../sounds/" + category + "/" + name;
    const sound = new Howl({
        src: [src]
    });

    Howler.volume(volume);
    sound.play();
}

module.exports = {
    play_sound: play_sound
};