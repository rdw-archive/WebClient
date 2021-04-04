// Utilites for working with vectors in the world space. Provided in JS since this is used for loading binaries, where performance is absolutely critical.
// Note: Vectors are expected to be passed as arrays (not objects!) with the format [ coordinateX, coordinateY, coordinateZ ].
// This is unfortunately not as readable as I'd like, but array performance is so much better than if we were to use objects
// ... particularly when calculating hundreds of thousands of vectors as required for the processing of files containing binary data, e.g. map geometry :/
// It's also why I copy/pasted some code instead of nesting function calls for the more complex operations; as we can easily avoid the overhead here.

// Calculates the mathematical normal vector for a given triangle.
// See https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-to-shading/shading-normals) for details!
function Math3D_CalculateFaceNormal(vectorA, vectorB, vectorC) {

    let faceNormal = [];
    let vectorP = [];
    let vectorQ = [];

    // vectorP = vectorB - vectorA
    vectorP[0] = vectorB[0] - vectorA[0];
    vectorP[1] = vectorB[1] - vectorA[1];
    vectorP[2] = vectorB[2] - vectorA[2];

    // vectorQ = vectorB - vectorA
    vectorQ[0] = vectorC[0] - vectorA[0];
    vectorQ[1] = vectorC[1] - vectorA[1];
    vectorQ[2] = vectorC[2] - vectorA[2];

    // faceNormal = (vectorB - vectorA).crossProduct(vectorC - vectorA);
    // faceNormal = (vectorP).crossProduct(vectorQ);

    // Copy/paste START
    // faceNormal = Math3D_CrossProduct(vectorP, vectorQ)
    faceNormal[0] = vectorP[1] * vectorQ[2] - vectorP[2] * vectorQ[1];
    faceNormal[1] = vectorP[2] * vectorQ[0] - vectorP[0] * vectorQ[2];
    faceNormal[2] = vectorP[0] * vectorQ[1] - vectorP[1] * vectorQ[0];
    // Copy/paste END

    // Copy/paste START
    // faceNormal = Math3D_NormalizeVector(faceNormal)
    let normalizationFactor = 1 / Math.sqrt(faceNormal[0] * faceNormal[0] + faceNormal[1] * faceNormal[1] + faceNormal[2] * faceNormal[2]);
    faceNormal[0] = faceNormal[0] * normalizationFactor;
    faceNormal[1] = faceNormal[1] * normalizationFactor;
    faceNormal[2] = faceNormal[2] * normalizationFactor;
    // Copy/paste END

    return faceNormal;

}

// Calculates the smooth normal vector for a given triangle, applying Gouraud shading to linearly interpolate normals.
// See https://en.wikipedia.org/wiki/Gouraud_shading and the above link for details!
function Math3D_CalculateSmoothNormal(vectorA, vectorB, vectorC) {

    // // compute "smooth" normal using Gouraud's technique (interpolate vertex normals)
    // const Vec3f & n0 = N[trisIndex[triIndex * 3]];
    // const Vec3f & n1 = N[trisIndex[triIndex * 3 + 1]];
    // const Vec3f & n2 = N[trisIndex[triIndex * 3 + 2]];
    // hitNormal = (1 - uv.x - uv.y) * n0 + uv.x * n1 + uv.y * n2;

}

// Averages two given vectors and normalizes the result.
function Math3D_AverageNormals(vectorA, vectorB) {

    let normalizedAverage = [];

    // normalizedAverage = avg(vectorA, vectorB) = 1/2 * (vectorA + vectorB)
    normalizedAverage[0] = 1 / 2 * (vectorA[0] + vectorB[0]);
    normalizedAverage[1] = 1 / 2 * (vectorA[1] + vectorB[1]);
    normalizedAverage[2] = 1 / 2 * (vectorA[2] + vectorB[2]);

    // Copy/paste START
    // normalizedAverage = Math3D_NormalizeVector(normalizedAverage)
    let normalizationFactor = 1 / Math.sqrt(normalizedAverage[0] * normalizedAverage[0] + normalizedAverage[1] * normalizedAverage[1] + normalizedAverage[2] * normalizedAverage[2]);
    normalizedAverage[0] = normalizedAverage[0] * normalizationFactor;
    normalizedAverage[1] = normalizedAverage[1] * normalizationFactor;
    normalizedAverage[2] = normalizedAverage[2] * normalizationFactor;
    // Copy/paste END

    return normalizedAverage;

}

// Normalizes a given vector (reduces the length to one unit). This is just a generalization of Pythagoras' theorem to 3D space :)
// See https://en.wikipedia.org/wiki/Pythagorean_theorem for details!
function Math3D_NormalizeVector(vector) {

    // normalizationFactor = unitLength / vectorLength = 1 / sqrt(x^2 + y^2 + z^2)
    let normalizationFactor = 1 / Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]);
    vector[0] = vector[0] * normalizationFactor;
    vector[1] = vector[1] * normalizationFactor;
    vector[2] = vector[2] * normalizationFactor;

    return vector; // Not needed, the value is modified internally (this might not be the desired behaviour for some cases?)
}

// Calculates the cross product (i.e., vector product, NOT scalar product) for two given vectors.
// The result will be orthogonal if both vectors are linearly independent; see https://en.wikipedia.org/wiki/Cross_product for details!
function Math3D_CrossProduct(vectorA, vectorB) {

    let crossProduct = [];

    // crossProduct.x = vectorA.y * vectorB.z - vectorA.z * vectorB.y
    // crossProduct.y = vectorA.z * vectorB.x - vectorA.x * vectorB.z
    // crossProduct.z = vectorA.x * vectorB.y - vectorA.y * vectorB.x
    crossProduct[0] = vectorA[1] * vectorB[2] - vectorA[2] * vectorB[1];
    crossProduct[1] = vectorA[2] * vectorB[0] - vectorA[0] * vectorB[2];
    crossProduct[2] = vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0];

    return crossProduct;

}

const NUM_UVS_PER_VERTEX = 2; // (x,y) values for each
const NUM_UVS_PER_FRAME = 4 * NUM_UVS_PER_VERTEX; // One vertex for each of the corners: southwest, southest, northwest, northeast
const NUM_INDICES_PER_VERTEX = 3; // x, y, z coordinates, indices as in "indices in the vertex array", NOT connections

// Transforms all coordinates for a given texture so that they refer to the frame's new position in the texture atlas
// TODO in place vs new array? (memory usage...)
function Math2D_TransformTexCoords(textureCoordinates, bitmaps, submeshesMetadata, atlasWidth, atlasHeight) {

    console.log(textureCoordinates);
    console.log(bitmaps);
    console.log(submeshesMetadata);
    console.log(atlasWidth);
    console.log(atlasHeight);

    // Example: Transforming the point 0.5 in a 256px BMP to the one in a frame that is placed 5px off in the atlas
    // That is, calculate transform(0.5, 5, 256, 2048)
    // x = 0.5 * 256 = 128
    // x = 128 + 5 = 133
    // u = 133 / 2048 = 0.065
    // The atlas is far larger so the relative coordinates are smaller, even if the absolute ones in the frame are identical
    function transformU(u, offsetX, frameWidth, atlasWidth) {
        // Obtain absoulte coordinate in the local texture space, from its percentage (UV coordinate)
        let x = frameWidth * u;
        // Move the vector's X coordinate to the start of the frame in the texture atlas (essentially remapping the origin)
        x = x + offsetX;
        // x = x + 1;
        // x = atlasWidth - x
        // Translate this transformed origin back into a UV coordinate in the atlas space
        // u = x / frameWidth * atlasWidth;
        u = x / atlasWidth;

        // u = u + 1/atlasWidth
        // u = Math.floor(u)
        return u;
    }

    function transformV(v, offsetY, frameHeight, atlasHeight) {
        let y = frameHeight * (1 - v); // TODO setting for inverY (BJS has it readonly??)
        y = (y + offsetY);
        // y = atlasHeight - y // inverted Y
        // v = y / frameHeight * atlasHeight;
        v = y / atlasHeight;
        // v = 1 - ((y - 1) / frameHeight * atlasHeight);
        // v = Math.ceil(v)
        return v;
    }

    // The UV coords are given in ascending order of the submeshes,i.e. UV = (submesh1_UVs, submesh2_UVs, ..., submeshN_UVs)
    // as the vertices are connected in that order. We can calculate a general offset applicable to all vertices of a submesh
    // since each submesh is defined exactly by all the vertices that use a particular texture file, mapping the origin (i.e., the vector (0,0)) in the original texture file to its positional offset (x, y) in the texture atlas's image.
    // The latter was generated by the bin packer and is then stored in the frame data for a given texture/submesh.
    // Each frame refers to exactly one texture and thus, exactly one submesh, so we've covered all if we transform them this way!


    let stats = {
        u: [],
        v: []
    };


    // Used for debugging only (see below)
    let insetStatsX = [];
    let insetStatsY = [];

    // for (let submeshIndex = 0; submeshIndex < 1; submeshIndex++) {
    for (let submeshIndex = 0; submeshIndex < submeshesMetadata.length; submeshIndex++) {

        // Transform UV shell (frame/image)

        // Transform first texture image coordinates
        let submeshData = submeshesMetadata[submeshIndex];
        let firstSubmeshVertexIndex = submeshData.verticesStartIndex;
        let lastSubmeshVertexIndex = (firstSubmeshVertexIndex + submeshData.numVertexIndices);
        // let submeshVertexCount = submeshNumVertexIndices / NUM_INDICES_PER_VERTEX;
        let firstVectorIndex = firstSubmeshVertexIndex / NUM_INDICES_PER_VERTEX;
        let lastVectorIndex = lastSubmeshVertexIndex / NUM_INDICES_PER_VERTEX;
        let firstUvIndex = firstVectorIndex * NUM_UVS_PER_VERTEX;
        let lastUvIndex = lastVectorIndex * NUM_UVS_PER_VERTEX;

        // if (((firstIndex % NUM_UVS_PER_FRAME) !== 0) || ((lastIndex % NUM_UVS_PER_FRAME) !== 0))
        //     // This should never happen, but I'd rather get an error than a silent failure here...
        //     throw new Error("Failed to transform indices (something in the calculation must be wrong!?)");

        // The bin packer reorders them, so we must use the frameID attribute we stored for this purpose
        function getBitmapForFrame(frameID) {

            for (index = 0; index < bitmaps.length; index++) {
                let bitmap = bitmaps[index];
                if (bitmap.textureID == frameID) return bitmap; // There can only be one
            }
        }

        // TODO let vs nothing in loop variable declaration?
        // The vector at lastIndex is still part of the submesh! (so we must use <= and not < to also transform it)
        for (let uvIndex = firstUvIndex; uvIndex < lastUvIndex; uvIndex = uvIndex + NUM_UVS_PER_FRAME) {

            let textureID = submeshIndex;
            let bitmap = getBitmapForFrame(textureID);
            let offsetX = bitmap.x;
            let offsetY = bitmap.y;
            let frameWidth = bitmap.width;
            let frameHeight = bitmap.height;

            // One transformation per corner, done in place to minimize memory usage
            // Could probably remove the function calls to reduce overhead, as well.Maybe later?
            // However, it's easier to visualize as linear transformations (for me, anyway)
            // That is, transforming each vector coordinate from 2D -> 2D space (local to atlas coordinates)

            // Step by step for debugging
            let southwestUVx = textureCoordinates[uvIndex + 0];

            if (stats.u[southwestUVx] === undefined) stats.u[southwestUVx] = 0;
            stats.u[southwestUVx]++
            if (isNaN(southwestUVx))
                console.log("UV coords are NaN (this can't be right)! Textures WILL be glitched if you don't fix this.")


            southwestUVx = transformU(textureCoordinates[uvIndex + 0], offsetX, frameWidth, atlasWidth);
            let southwestUVy = textureCoordinates[uvIndex + 1];
            southwestUVy = transformV(textureCoordinates[uvIndex + 1], offsetY, frameHeight, atlasHeight);
            let southeastUVx = textureCoordinates[uvIndex + 2];
            southeastUVx = transformU(textureCoordinates[uvIndex + 2], offsetX, frameWidth, atlasWidth);
            let southeastUVy = textureCoordinates[uvIndex + 3];
            southeastUVy = transformV(textureCoordinates[uvIndex + 3], offsetY, frameHeight, atlasHeight);
            let northwestUVx = textureCoordinates[uvIndex + 4];
            northwestUVx = transformU(textureCoordinates[uvIndex + 4], offsetX, frameWidth, atlasWidth);
            let northwestUVy = textureCoordinates[uvIndex + 5];
            northwestUVy = transformV(textureCoordinates[uvIndex + 5], offsetY, frameHeight, atlasHeight);
            let northeastUVx = textureCoordinates[uvIndex + 6];
            northeastUVx = transformU(textureCoordinates[uvIndex + 6], offsetX, frameWidth, atlasWidth);
            let northeastUVy = textureCoordinates[uvIndex + 7];
            northeastUVy = transformV(textureCoordinates[uvIndex + 7], offsetY, frameHeight, atlasHeight);

            //     function get_texel_coords(x, y, tex_width, tex_height)
            //     {
            //     u = (x + 0.5) / tex_width
            //     v = (y + 0.5) / tex_height
            //     return u, v
            // }

            // function getTexelCoordsX(uvX) {

            //     let offsetU = (0.5 / frameWidth) // in pixels = 0.5 to the center
            //     let u = uvx + offsetU / atlasWidth
            // }

            // Due to how BJS uses the provided UVs, one pixel OUTSIDE of the texture will be included, causing visible seams
            // As a workaround we can correct this by adding an inset to each point's coordinate, i.e., 1 px towards the center
            function applyInsetTransformX(pointX) {

                return pointX;

                let translationScale = 1 / atlasWidth; // 1px translated to atlas space, which is where we are after transformX()

                // If interpreted as a vector, we can compute the center point by averaging the four corners
                let centerPointX = 1 / 4 * (southwestUVx + southeastUVx + northwestUVx + northeastUVx)

                // This gives a vector from the point to the center, which is "too long"
                // since we only want to go sqrt(2) in this direction (sqrt( 1^2 + 1^2) is the length of the vector (1,1) etc)
                let insetDirectionX = centerPointX - pointX
                // So by making sure its coordinates are always 1 but the direction is kept, we get the inset vector
                let scaledInsetDirectionX = (insetDirectionX / Math.abs(insetDirectionX)) // This leaves only the sign
                scaledInsetDirectionX = 1 / 2    * scaledInsetDirectionX // we want to aim at the center and not the edge to avoid bleeding
                // Adding it to each point gets us a vector pointing from the point to the center
                // (i.e., in direction of the inset), which lies exactly where the point lay but 1 pixel further on the inside
                let insetVectorX = pointX + scaledInsetDirectionX * translationScale // 1px translated to atlas space

                // Debugging stats (uncomment and then use the Chrome debugger for example)
                // if (insetStatsX[insetVectorX] === undefined)
                //     insetStatsX[insetVectorX] = 0;
                // insetStatsX[insetVectorX]++;

                return insetVectorX
            }

            // Same thing, different axis. We could use an array and calculate both coords at once, but meh
            function applyInsetTransformY(pointY, pointX) {
                return pointY;

                let translationScale = 1 / atlasHeight;
                let centerPointY = 1 / 4 * (southwestUVy + southeastUVy + northwestUVy + northeastUVy)
                let insetDirectionY = centerPointY - pointY
                let scaledInsetDirectionY = (insetDirectionY / Math.abs(insetDirectionY))
                scaledInsetDirectionY = 1 / 2 * scaledInsetDirectionY
                let insetVectorY = pointY + scaledInsetDirectionY * translationScale

                // Debugging stats (uncomment and then use the Chrome debugger for example)
                // if (insetStatsY[insetVectorY] === undefined)
                //     insetStatsY[insetVectorY] = 0;
                // insetStatsY[insetVectorY]++;

                return insetVectorY
            }

            textureCoordinates[uvIndex + 0] = applyInsetTransformX(southwestUVx);
            textureCoordinates[uvIndex + 1] = applyInsetTransformY(southwestUVy, southwestUVx);
            textureCoordinates[uvIndex + 2] = applyInsetTransformX(southeastUVx);
            textureCoordinates[uvIndex + 3] = applyInsetTransformY(southeastUVy, southeastUVx);
            textureCoordinates[uvIndex + 4] = applyInsetTransformX(northwestUVx);
            textureCoordinates[uvIndex + 5] = applyInsetTransformY(northwestUVy, northwestUVx);
            textureCoordinates[uvIndex + 6] = applyInsetTransformX(northeastUVx);
            textureCoordinates[uvIndex + 7] = applyInsetTransformY(northeastUVy, northeastUVx);



            // textureCoordinates[uvIndex + 0] = (10 + 128 + 0) / 2048;
            // textureCoordinates[uvIndex + 1] =  (atlasHeight - 10 - 0) / 2048;
            // textureCoordinates[uvIndex + 2] = (10 + 128 + 0) / 2048;
            // textureCoordinates[uvIndex + 3] = (atlasHeight - 10 - 0) / 2048;
            // textureCoordinates[uvIndex + 4] = (10 + 64 + 0) / 2048;
            // textureCoordinates[uvIndex + 5] = (atlasHeight - 10) / 2048;
            // textureCoordinates[uvIndex + 6] = (10 + 64) / 2048 ;
            // textureCoordinates[uvIndex + 7] = (atlasHeight - 10 - 64) / 2048;

            // textureCoordinates[uvIndex + 0] = (10 + 128) / 2048;
            // textureCoordinates[uvIndex + 1] =  (10 + 1) / 2048;
            // textureCoordinates[uvIndex + 2] = (10 + 128 + 0) / 2048;
            // textureCoordinates[uvIndex + 3] = (10 + 64 + 1) / 2048;
            // textureCoordinates[uvIndex + 4] = (10 + 64 + 0) / 2048;
            // textureCoordinates[uvIndex + 5] = (10) / 2048;
            // textureCoordinates[uvIndex + 6] = (10 + 64) / 2048 ;
            // textureCoordinates[uvIndex + 7] = (64 + 1) / 2048;


            // Inplace for performance
            // textureCoordinates[uvIndex + 0] = transformU(textureCoordinates[uvIndex + 0], offsetX, frameWidth, atlasWidth);
            // textureCoordinates[uvIndex + 1] = transformV(textureCoordinates[uvIndex + 1], offsetY, frameHeight, atlasHeight);
            // textureCoordinates[uvIndex + 2] = transformU(textureCoordinates[uvIndex + 2], offsetX, frameWidth, atlasWidth);
            // textureCoordinates[uvIndex + 3] = transformV(textureCoordinates[uvIndex + 3], offsetY, frameHeight, atlasHeight);
            // textureCoordinates[uvIndex + 4] = transformU(textureCoordinates[uvIndex + 4], offsetX, frameWidth, atlasWidth);
            // textureCoordinates[uvIndex + 5] = transformV(textureCoordinates[uvIndex + 5], offsetY, frameHeight, atlasHeight);
            // textureCoordinates[uvIndex + 6] = transformU(textureCoordinates[uvIndex + 6], offsetX, frameWidth, atlasWidth);
            // textureCoordinates[uvIndex + 7] = transformV(textureCoordinates[uvIndex + 7], offsetY, frameHeight, atlasHeight);
        }


    }

    // meshData.textureCoordinates, meshObject.atlas.framedata
    return textureCoordinates;

}

function Math3D_NormalizeVectorInPlace(vector) {
    const normalizationFactor = 1 / Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
    vector.x = vector.x * normalizationFactor;
    vector.y = vector.y * normalizationFactor;
    vector.z = vector.z * normalizationFactor;
}