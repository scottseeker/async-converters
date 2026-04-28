import ConverterShell from '../../components/ConverterShell/ConverterShell';
import UnitConverter from '../../components/UnitConverter/UnitConverter';
import { dataStorageConfig } from '../../converters/units/unitConfigs';

export default function DataStorageConverter() {
  return (
    <ConverterShell title={dataStorageConfig.title} description={dataStorageConfig.description} category="units">
      <UnitConverter config={dataStorageConfig} />
    </ConverterShell>
  );
}
