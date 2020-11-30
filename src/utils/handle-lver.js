function lverToObject(lver) {
  let arr = lver.split('.').map(i => Number(i))
  return {
    x: arr[0],
    y: arr[1],
    z: arr[2]
  }
}

/**
 * 判断版本号 currentVersion 是否高于 targetVersion
 * 如果高于返回 1, 等于返回 0 低于返回 -1
 */
function compareVersion(targetVersion, currentVersion) {
  if (targetVersion === currentVersion) {
    return 0
  }
  const target = lverToObject(targetVersion)
  const current = lverToObject(currentVersion)
  if (current.x > target.x) {
    return 1
  } else if (current.x === target.x) {
    if (current.y > target.y) {
      return 1
    } else if (current.y === target.y && current.z > target.z) {
      return 1
    }
  }
  return -1
}

export {compareVersion, lverToObject}
