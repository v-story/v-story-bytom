package com.bytom;

import com.google.gson.annotations.SerializedName;
import io.bytom.common.ParameterizedTypeImpl;
import io.bytom.common.Utils;
import io.bytom.exception.BytomException;
import io.bytom.http.Client;
import org.apache.log4j.Logger;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class BalancenoLog {

    /**
     * account id
     */
    @SerializedName("account_id")
    public String accountId;

    /**
     * name of account
     */
    @SerializedName("account_alias")
    public String accountAlias;

    /**
     * sum of the unspent outputs.
     * specified asset balance of account.
     */
    public long amount;

    /**
     * asset id
     */
    @SerializedName("asset_id")
    public String assetId;

    /**
     * name of asset
     */
    @SerializedName("asset_alias")
    public String assetAlias;

    @SerializedName("asset_definition")
    public Map<String, Object> definition;

    private static Logger logger = Logger.getLogger(BalancenoLog.class);

    /**
     * Serializes the Balance into a form that is safe to transfer over the wire.
     *
     * @return the JSON-serialized representation of the Receiver object
     */
    public String toJson() {
        return Utils.serializer.toJson(this);
    }


    public static class QueryBuilder {

        /**
         * Call list-Balances api
         *
         * @param client
         * @return
         * @throws BytomException
         */
        public List<BalancenoLog> list(Client client) throws BytomException {

            Type listType = new ParameterizedTypeImpl(List.class, new Class[]{BalancenoLog.class});
            List<BalancenoLog> balanceList = client.request("list-balances", null, listType);
            /*
            logger.info("list-balances:");
            logger.info("size of :" + balanceList.size());
            
            for (BalancenoLog result : balanceList) {
                logger.info(result.toJson());
            }
            */

            return balanceList;
        }

        /**
         * sum of all Asset alias amount
         *
         * @param client
         * @param assetAlias
         * @return
         * @throws BytomException
         */
        public BalancenoLog listByAssetAlias(Client client, String assetAlias) throws BytomException {
            List<BalancenoLog> balanceList = list(client);
            BalancenoLog assetBalance = new BalancenoLog();
            assetBalance.assetAlias = assetAlias;
            long amount = 0;
            for (BalancenoLog result : balanceList) {
                if (result.assetAlias.equals(assetAlias)) {
                    amount += result.amount;
                    assetBalance.assetId = result.assetId;
                }
            }
            assetBalance.amount = amount;

            //logger.info(assetBalance.toJson());

            return assetBalance;
        }

        /**
         * sum of all Account alias amount
         *
         * @param client
         * @param accountAlias
         * @return
         * @throws BytomException
         */
        public List<BalancenoLog> listByAccountAlias(Client client, String accountAlias) throws BytomException {
            List<BalancenoLog> balanceList = list(client);
            List<BalancenoLog> accountBalance = new ArrayList<>();
            for (BalancenoLog result : balanceList) {
                if (result.accountAlias.equals(accountAlias)) {
                    accountBalance.add(result);
                    //logger.info(result.toJson());
                }
            }
            return accountBalance;
        }
    }
}
