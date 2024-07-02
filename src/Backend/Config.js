import AWS from 'aws-sdk';

export default function configureAWS() {
  //const AssessKey = "AKIA2UC3FHGRHHPS4C4H";
  //const SAccessKey = "MG1T9l83pP44phUgO8/EUyjWkE5ya1dduFrqdL4v";
  AWS.config.update({
    region: 'eu-north-1',
    credentials: {
      accessKeyId: AssessKey,
      secretAccessKey: SAccessKey,
    },
  });
}
