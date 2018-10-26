'use strict';

var UnityFunc = {}

//this.position = MoveTowards(this.position, this.point, deltaTime * SingleSpeed);
UnityFunc.MoveTowards = function(current, target, maxDelta)
{
    var a = target.subtract(current);
    var magnitude = Math.sqrt(a.x*a.x + a.y*a.y + a.z*a.z);

    if (magnitude <= maxDelta || magnitude == 0) {
          return target;
    }

    current.x = current.x + a.x / magnitude * maxDelta;
    current.y = current.y + a.y / magnitude * maxDelta;
    current.z = current.z + a.z / magnitude * maxDelta;

    return current;
}

//var rotation = QuaternionLookRotation(relativePos, Vector3.Up());
UnityFunc.QuaternionLookRotation = function(forward, up) {
    
    forward.normalize();

    var vector = forward.normalize();
    var vector1 = Vector3.Cross(up, vector);
    var vector2 = vector1.normalize();
    var vector3 = Vector3.Cross(vector, vector2);

    var m00 = vector2.x;
    var m01 = vector2.y;
    var m02 = vector2.z;
    var m10 = vector3.x;
    var m11 = vector3.y;
    var m12 = vector3.z;
    var m20 = vector.x;
    var m21 = vector.y;
    var m22 = vector.z;


    var num8 = (m00 + m11) + m22;
    var quaternion = new BABYLON.Quaternion(0,0,0,0);
    if (num8 > 0)
    {
        var num = Math.sqrt(num8 + 1);
        quaternion.w = num * 0.5;
        num = 0.5 / num;
        quaternion.x = (m12 - m21) * num;
        quaternion.y = (m20 - m02) * num;
        quaternion.z = (m01 - m10) * num;
        return quaternion;
    }
    if ((m00 >= m11) && (m00 >= m22))
    {
        var num7 = Math.sqrt(((1 + m00) - m11) - m22);
        var num4 = 0.5 / num7;
        quaternion.x = 0.5 * num7;
        quaternion.y = (m01 + m10) * num4;
        quaternion.z = (m02 + m20) * num4;
        quaternion.w = (m12 - m21) * num4;
        return quaternion;
    }
    if (m11 > m22)
    {
        var num6 = Math.sqrt(((1 + m11) - m00) - m22);
        var num3 = 0.5 / num6;
        quaternion.x = (m10+ m01) * num3;
        quaternion.y = 0.5 * num6;
        quaternion.z = (m21 + m12) * num3;
        quaternion.w = (m20 - m02) * num3;
        return quaternion; 
    }
    var num5 = Math.sqrt(((1 + m22) - m00) - m11);
    var num2 = 0.5 / num5;
    quaternion.x = (m20 + m02) * num2;
    quaternion.y = (m21 + m12) * num2;
    quaternion.z = 0.5 * num5;
    quaternion.w = (m01 - m10) * num2;
    return quaternion;
}