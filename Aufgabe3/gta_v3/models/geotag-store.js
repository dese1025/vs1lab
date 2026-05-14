// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

const GeoTagExamples = require("./geotag-examples");
const GeoTag = require("./geotag");

/**
 * A class for in-memory-storage of geotags
 *
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 *
 * Provide a method 'addGeoTag' to add a geotag to the store.
 *
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 *
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 *
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields.
 */
class InMemoryGeoTagStore {

    // TODO: ... your code here ...
    #geoTagStore;

    constructor(geoTagStore) {
        this.#geoTagStore = [];
        for (const tag in geoTagStore) {
            this.addGeoTag(tag);
        }
    }

    addGeoTag(geoTag) {
        this.#geoTagStore.push(geoTag);
    }

    removeGeoTag(geoTag) {
        let index = this.#getIndexByName(geoTag.name);
        this.#geoTagStore.splice(index, 1);
    }

    getNearbyGeoTags(location, radius) {
        return this.#getInRadius(location, radius);
    }

    searchNearbyGeoTags(location, radius, keyword) {
        let nearbyTags = this.#getInRadius(location, radius);
        let resultArray = [];
        nearbyTags.forEach(tag => {
            if (this.#hasKeywordMatch(keyword, tag)) {
                resultArray.push(tag);
            }
        });
        return resultArray;
    }

    readExamples() {
        let tagList = GeoTagExamples.tagList;
        tagList.forEach(tagData => {
            this.addGeoTag(new GeoTag(tagData[0], tagData[3], tagData[1], tagData[2]));
        });
    }

    #hasKeywordMatch(keyword, tag) {
        const search = keyword.trim().toLowerCase();
        if (search === "") {
            return true;
        }
        const nameMatches =
            tag.name &&
            tag.name.toLowerCase().includes(search);
        const hashtagMatches =
            tag.hash &&
            tag.hash.includes(search);
        return nameMatches || hashtagMatches;
    }

    #getInRadius(location, radius) {
        const lat1 = location.latitude;
        const lon1 = location.longitude;
        const resultArray = [];
        const R = 6371000; // Erdradius in Metern

        this.#geoTagStore.forEach(tag => {
            const lat2 = tag.latitude;
            const lon2 = tag.longitude;

            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;

            const radLat1 = lat1 * Math.PI / 180;
            const radLat2 = lat2 * Math.PI / 180;

            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(radLat1) * Math.cos(radLat2) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distance = R * c;

            if (distance <= radius) {
                resultArray.push(tag);
            }
        });

        return resultArray;
    }

    #getIndexByName(name) {
        for (let i = 0; i < this.#geoTagStore.length; i++) {
            if (this.#geoTagStore[i].name === name) {
                return i;
            }
        }
    }

}

module.exports = InMemoryGeoTagStore
