class KeyNode {
  public key: string;

  constructor(key: string) {
    this.key = key;
  }
}

const HashSet = () => {
  const loadFactor = 0.75;
  let bucketCapacity = 16;
  let bucketSize = 0;
  let bucket: Array<Array<KeyNode>> = [];

  function hash(key: string): number {
    // http://www.cse.yorku.ca/~oz/hash.html
    let hash = 5381;

    for (const c of key) {
      hash = ((hash << 5) + hash + c.charCodeAt(0)) % bucketCapacity;
    }

    return hash;
  }

  function set(key: string) {
    const { node, index } = findNode(key);

    if (!bucket[index]) {
      bucket[index] = [];
    }

    if (!node) {
      bucket[index].push(new KeyNode(key));
      bucketSize += 1;
    }

    if(isHighLoadFactor()) resize();
  }

  function isHighLoadFactor(): boolean {
    return bucketSize / bucketCapacity >= loadFactor;
  }

  function findNode(key: string): { node: KeyNode | null; index: number } {
    const index = hash(key);

    if (!bucket[index]) return { node: null, index };

    const targetNode = bucket[index].find((node) => node.key === key) || null;
    return { node: targetNode, index };
  }

  function has(key: string): boolean {
    return findNode(key).node !== null;
  }

  function length(): number {
    return bucketSize;
  }

  function remove(key: string): boolean {
    if (!has(key)) return false;

    const { index } = findNode(key);
    bucket[index] = bucket[index].filter((node) => node.key !== key);

    return true;
  }

  function keys(): Array<string> {
    const tempArray: Array<string> = [];
    
    bucket.flat().forEach(e => tempArray.push(e.key));

    return tempArray;
  }

  function clear(): void {
    bucket = Array(bucketCapacity);
    bucketSize = 0;
  }

  function resize(): void {
    const nodes = bucket.flat();
    bucketCapacity *= 2;

    clear();

    nodes.forEach(node => {
      set(node.key);
    });
  }

  return Object.freeze({
    set,
    has,
    length,
    remove,
    keys,
    clear,
  });
};





