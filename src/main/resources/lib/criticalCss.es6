const libs = {
  io: require('/lib/xp/io')
};

export default function getCriticalCss({ path }) {
  const filePath = resolve(`/assets/${path}`);
  const resource = libs.io.getResource(filePath);
  return libs.io.readText(resource.getStream());
}
