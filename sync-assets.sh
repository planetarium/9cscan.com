#!/bin/sh

SYNC9C() {
    mkdir -p "./public/$1" && cp ./$1/$2 ./public/$1
}

SYNC9C NineChronicles/nekoyume/Assets/AddressableAssets/TableCSV/Item *.csv
SYNC9C NineChronicles/nekoyume/Assets/Resources/UI/Icons/Item *.png
SYNC9C NineChronicles/nekoyume/Assets/StreamingAssets/Localization *.csv
