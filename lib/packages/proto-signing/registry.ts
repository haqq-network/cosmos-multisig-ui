/* eslint-disable @typescript-eslint/naming-convention */
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { TxBody } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Any } from "cosmjs-types/google/protobuf/any";
import Long from "long";
import type protobuf from "protobufjs";

/**
 * A type generated by [ts-proto](https://github.com/stephenh/ts-proto).
 */
export interface TsProtoGeneratedType {
  readonly encode: (
    message: any | { [k: string]: any },
    writer?: protobuf.Writer,
  ) => protobuf.Writer;
  readonly decode: (input: Uint8Array | protobuf.Reader, length?: number) => any;
  readonly fromJSON: (object: any) => any;
  readonly fromPartial: (object: any) => any;
  readonly toJSON: (message: any | { [k: string]: any }) => unknown;
}

/**
 * A type generated by [protobufjs](https://github.com/protobufjs/protobuf.js).
 *
 * This can be used if you want to create types at runtime using pure JavaScript.
 * See https://gist.github.com/fadeev/a4981eff1cf3a805ef10e25313d5f2b7
 */
export interface PbjsGeneratedType {
  readonly create: (properties?: { [k: string]: any }) => any;
  readonly encode: (
    message: any | { [k: string]: any },
    writer?: protobuf.Writer,
  ) => protobuf.Writer;
  readonly decode: (reader: protobuf.Reader | Uint8Array, length?: number) => any;
}

export type GeneratedType = TsProtoGeneratedType | PbjsGeneratedType;

export function isTsProtoGeneratedType(type: GeneratedType): type is TsProtoGeneratedType {
  return typeof (type as TsProtoGeneratedType).fromPartial === "function";
}

export function isPbjsGeneratedType(type: GeneratedType): type is PbjsGeneratedType {
  return !isTsProtoGeneratedType(type);
}

const defaultTypeUrls = {
  cosmosCoin: "/cosmos.base.v1beta1.Coin",
  cosmosMsgSend: "/cosmos.bank.v1beta1.MsgSend",
  cosmosTxBody: "/cosmos.tx.v1beta1.TxBody",
  googleAny: "/google.protobuf.Any",
};

export interface DecodeObject {
  readonly typeUrl: string;
  readonly value: Uint8Array;
}

export interface EncodeObject {
  readonly typeUrl: string;
  readonly value: any;
}

interface TxBodyValue {
  readonly messages: readonly EncodeObject[];
  readonly memo?: string;
  readonly timeoutHeight?: Long;
  readonly extensionOptions?: Any[];
  readonly nonCriticalExtensionOptions?: Any[];
}

export interface TxBodyEncodeObject extends EncodeObject {
  readonly typeUrl: "/cosmos.tx.v1beta1.TxBody";
  readonly value: TxBodyValue;
}

export function isTxBodyEncodeObject(
  encodeObject: EncodeObject,
): encodeObject is TxBodyEncodeObject {
  return (encodeObject as TxBodyEncodeObject).typeUrl === "/cosmos.tx.v1beta1.TxBody";
}

export class Registry {
  private readonly types: Map<string, GeneratedType>;

  /**
   * Creates a new Registry for mapping protobuf type identifiers/type URLs to
   * actual implementations. Those implementations are typically generated with ts-proto
   * but we also support protobuf.js as a type generator.
   *
   * If there is no parameter given, a `new Registry()` adds the types `Coin` and `MsgSend`
   * for historic reasons. Those can be overriden by customTypes.
   *
   * There are currently two methods for adding new types:
   * 1. Passing types to the constructor.
   * 2. Using the `register()` method
   */
  public constructor(customTypes?: Iterable<[string, GeneratedType]>) {
    const { cosmosCoin, cosmosMsgSend } = defaultTypeUrls;
    this.types = customTypes
      ? new Map<string, GeneratedType>([...customTypes])
      : new Map<string, GeneratedType>([
          [cosmosCoin, Coin],
          [cosmosMsgSend, MsgSend],
        ]);
  }

  public register(typeUrl: string, type: GeneratedType): void {
    this.types.set(typeUrl, type);
  }

  /**
   * Looks up a type that was previously added to the registry.
   *
   * The generator information (ts-proto or pbjs) gets lost along the way.
   * If you need to work with the result type in TypeScript, you can use:
   *
   * ```
   * import { assert } from "@/lib/packages/utils";
   *
   * const Coin = registry.lookupType("/cosmos.base.v1beta1.Coin");
   * assert(Coin); // Ensures not unset
   * assert(isTsProtoGeneratedType(Coin)); // Ensures this is the type we expect
   *
   * // Coin is typed TsProtoGeneratedType now.
   * ```
   */
  public lookupType(typeUrl: string): GeneratedType | undefined {
    return this.types.get(typeUrl);
  }

  private lookupTypeWithError(typeUrl: string): GeneratedType {
    const type = this.lookupType(typeUrl);
    if (!type) {
      throw new Error(`Unregistered type url: ${typeUrl}`);
    }
    return type;
  }

  /**
   * Takes a typeUrl/value pair and encodes the value to protobuf if
   * the given type was previously registered.
   *
   * If the value has to be wrapped in an Any, this needs to be done
   * manually after this call. Or use `encodeAsAny` instead.
   */
  public encode(encodeObject: EncodeObject): Uint8Array {
    const { value, typeUrl } = encodeObject;
    if (isTxBodyEncodeObject(encodeObject)) {
      return this.encodeTxBody(value);
    }
    const type = this.lookupTypeWithError(typeUrl);
    const instance = isTsProtoGeneratedType(type) ? type.fromPartial(value) : type.create(value);
    return type.encode(instance).finish();
  }

  /**
   * Takes a typeUrl/value pair and encodes the value to an Any if
   * the given type was previously registered.
   */
  public encodeAsAny(encodeObject: EncodeObject): Any {
    const binaryValue = this.encode(encodeObject);
    return Any.fromPartial({
      typeUrl: encodeObject.typeUrl,
      value: binaryValue,
    });
  }

  public encodeTxBody(txBodyFields: TxBodyValue): Uint8Array {
    const wrappedMessages = txBodyFields.messages.map((message) => this.encodeAsAny(message));
    const txBody = TxBody.fromPartial({
      ...txBodyFields,
      messages: wrappedMessages,
    });
    return TxBody.encode(txBody).finish();
  }

  public decode({ typeUrl, value }: DecodeObject): any {
    if (typeUrl === defaultTypeUrls.cosmosTxBody) {
      return this.decodeTxBody(value);
    }
    const type = this.lookupTypeWithError(typeUrl);
    const decoded = type.decode(value);
    Object.entries(decoded).forEach(([key, val]: [string, any]) => {
      if (
        typeof Buffer !== "undefined" &&
        typeof Buffer.isBuffer !== "undefined" &&
        Buffer.isBuffer(val)
      ) {
        decoded[key] = Uint8Array.from(val);
      }
    });
    return decoded;
  }

  public decodeTxBody(txBody: Uint8Array): TxBody {
    const decodedTxBody = TxBody.decode(txBody);

    return {
      ...decodedTxBody,
      messages: decodedTxBody.messages.map(({ typeUrl: typeUrl, value }: Any) => {
        if (!typeUrl) {
          throw new Error("Missing type_url in Any");
        }
        if (!value) {
          throw new Error("Missing value in Any");
        }
        return this.decode({ typeUrl, value });
      }),
    };
  }
}
